#[dojo::interface]
trait IActions {
    fn spawn_miner(ref world: IWorldDispatcher);
    fn buy_axe(ref world: IWorldDispatcher, qty: u8);
    fn start_mining(
        ref world: IWorldDispatcher,
        miner_id: u32,
        mine_id: u32,
        choice: dugdug::models::MinerChoice
    );
    fn check_mining(ref world: IWorldDispatcher, miner_id: u32, mine_id: u32);
    fn leave_mine(ref world: IWorldDispatcher, miner_id: u32, mine_id: u32);
    fn create_mine(ref world: IWorldDispatcher);
}


#[dojo::contract]
mod actions {
    use super::{IActions};
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use dugdug::models::{
        Miner, Mine, MineTrait, MinerTrait, MinerStatus, MineStatus, MinerChoice, GearLevel
    };

    use dugdug::constants::{TIME_BETWEEN_CHECKS};

    use dugdug::tokens::AXE::{
        IAXE, IAXEDispatcher, IAXEDispatcherTrait, IERC20BridgeableInitializerDispatcher,
        IERC20BridgeableInitializerDispatcherTrait, IERC20BridgeableInitializer
    };

    use dugdug::tokens::MINERAL::{IMineral, IMineralDispatcher, IMineralDispatcherTrait};

    use dugdug::events::{MineralFoundHaiku};

    fn get_axe(world: IWorldDispatcher) -> IAXEDispatcher {
        let (class_hash, contract_address) =
            match world.resource(selector_from_tag!("dugdug-Axe")) {
            dojo::world::Resource::Contract((
                class_hash, contract_address
            )) => (class_hash, contract_address),
            _ => (0.try_into().unwrap(), 0.try_into().unwrap())
        };

        if class_hash.is_zero() || contract_address.is_zero() {
            panic!("Invalid resource!");
        }

        IAXEDispatcher { contract_address }
    }

    fn get_mineral(world: IWorldDispatcher) -> IMineralDispatcher {
        let (class_hash, contract_address) =
            match world.resource(selector_from_tag!("dugdug-Mineral")) {
            dojo::world::Resource::Contract((
                class_hash, contract_address
            )) => (class_hash, contract_address),
            _ => (0.try_into().unwrap(), 0.try_into().unwrap())
        };

        if class_hash.is_zero() || contract_address.is_zero() {
            panic!("Invalid resource!");
        }

        IMineralDispatcher { contract_address }
    }


    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn_miner(ref world: IWorldDispatcher) {
            set!(world, (MinerTrait::new(world)));
        }
        fn buy_axe(ref world: IWorldDispatcher, qty: u8) {
            let q: u256 = qty.into() * 1000000000000000000;
            get_axe(world).mint_from(get_caller_address(), q.into());
        }
        fn start_mining(
            ref world: IWorldDispatcher, miner_id: u32, mine_id: u32, choice: MinerChoice
        ) {
            let mut miner = get!(world, (miner_id), Miner);
            let mut mine = get!(world, (mine_id), Mine);

            get_axe(world).burn_from(get_caller_address(), (1 * 1000000000000000000).into());

            // assert not already mining or in mine
            assert(miner.mine_id == 0, 'Miner is already in mine');

            match miner.status {
                MinerStatus::Idle => { miner.status = MinerStatus::Mining; },
                MinerStatus::Mining => { assert(false, 'Miner is already mining'); }
            }

            match mine.current_status {
                MineStatus::Open => {
                    match choice {
                        MinerChoice::Selfish => { mine.selfish_miners += 1; },
                        MinerChoice::Selfless => { mine.selfless_miners += 1; },
                        MinerChoice::None => { assert(false, ' wrong'); }
                    }
                    // Re-check the status after potential state change
                    mine.check_mine_state(world, choice);

                    match mine.current_status {
                        MineStatus::Open => {
                            miner.mine_id = mine_id;
                            miner.choice = choice;
                            miner.last_checkup = get_block_timestamp();
                        },
                        MineStatus::Mined => {
                            let total_miners = mine.selfish_miners
                                + mine.selfless_miners
                                + 1; // +1 to include current miner
                            let selfish_share = 75; // 75% share for selfish miners
                            let selfless_share = 100
                                - selfish_share; // 25% share for selfless miners

                            let miner_payout = match choice {
                                MinerChoice::Selfish => {
                                    if mine.selfish_miners > 0 {
                                        (mine.mineral_payout
                                            * selfish_share
                                            / (100 * total_miners.into()))
                                            .into()
                                    } else {
                                        0
                                    }
                                },
                                MinerChoice::Selfless => {
                                    if mine.selfless_miners > 0 {
                                        (mine.mineral_payout
                                            * selfless_share
                                            / (100 * total_miners.into()))
                                            .into()
                                    } else {
                                        0
                                    }
                                },
                                MinerChoice::None => {
                                    assert(false, 'Invalid choice');
                                    0
                                },
                            };

                            let payout: u256 = miner_payout * 1000000000000000000;
                            get_mineral(world).mint_from(get_caller_address(), payout.into());

                            miner.xp += 5;
                            miner.status = MinerStatus::Idle;
                            miner.mine_id = 0;
                            miner.last_checkup = 0;

                            let mine1 = MineTrait::new(world);
                            let mine2 = MineTrait::new(world);

                            set!(world, (mine1, mine2));

                            emit!(
                                world,
                                MineralFoundHaiku {
                                    id: world.uuid(),
                                    timestamp: get_block_timestamp(),
                                    seed: mine.seed,
                                    minerals: mine.mineral_payout,
                                }
                            );
                        },
                        MineStatus::Collapsed => {
                            miner.mine_id = mine_id;
                            miner.choice = choice;
                            miner.last_checkup = get_block_timestamp();

                            let mine1 = MineTrait::new(world);
                            let mine2 = MineTrait::new(world);

                            set!(world, (mine1, mine2));
                        },
                    }
                },
                MineStatus::Mined => { assert(false, 'Mined already'); },
                MineStatus::Collapsed => { assert(false, 'Mine is collapsed'); },
            }

            set!(world, (miner, mine));
        }
        fn check_mining(ref world: IWorldDispatcher, miner_id: u32, mine_id: u32) {
            let mut miner = get!(world, (miner_id), Miner);
            let mut mine = get!(world, (mine_id), Mine);

            assert(miner.mine_id == mine_id, 'Miner is not in mine');

            // TODO: owner check
            assert(miner.owner == get_caller_address(), 'Miner is not owned by caller');

            // check if been at least 15 minutes since last checkup
            assert(
                miner.last_checkup + TIME_BETWEEN_CHECKS < get_block_timestamp(),
                'Miner is not due for checkup'
            );

            mine.check_mine_state(world, miner.choice);

            miner.last_checkup = get_block_timestamp();

            set!(world, (mine));
        }
        fn leave_mine(ref world: IWorldDispatcher, miner_id: u32, mine_id: u32) {
            let mut miner = get!(world, (miner_id), Miner);
            let mut mine = get!(world, (mine_id), Mine);

            // assert miner in mine
            assert(miner.mine_id == mine_id, 'Miner is not in mine');

            update_mine(world, ref miner, ref mine);

            set!(world, (miner, mine));
        }
        fn create_mine(ref world: IWorldDispatcher) {
            let mine = MineTrait::new(world);

            set!(world, (mine));
        }
    }

    fn update_mine(world: IWorldDispatcher, ref miner: Miner, ref mine: Mine) {
        match mine.current_status {
            MineStatus::Open => {
                mine.check_mine_state(world, miner.choice);
                // Re-check the status after potential state change
                match mine.current_status {
                    MineStatus::Open => {
                        miner.status = MinerStatus::Idle;
                        miner.xp += 1;
                        miner.mine_id = 0;
                        miner.last_checkup = 0;

                        assert(
                            miner.last_checkup + TIME_BETWEEN_CHECKS < get_block_timestamp(),
                            'Still mining'
                        );

                        match miner.choice {
                            MinerChoice::Selfish => { mine.selfish_miners -= 1; },
                            MinerChoice::Selfless => { mine.selfless_miners -= 1; },
                            MinerChoice::None => { assert(false, 'Invalid choice'); }
                        }
                    },
                    MineStatus::Mined => {
                        miner.xp += 5;
                        miner.status = MinerStatus::Idle;
                        miner.mine_id = 0;
                        miner.last_checkup = 0;
                        match miner.choice {
                            MinerChoice::Selfish => {},
                            MinerChoice::Selfless => {},
                            MinerChoice::None => { assert(false, 'Invalid choice'); }
                        }

                        let mine1 = MineTrait::new(world);
                        let mine2 = MineTrait::new(world);
                        let mine3 = MineTrait::new(world);

                        set!(world, (mine1, mine2, mine3));

                        let total_miners = mine.selfish_miners
                            + mine.selfless_miners
                            + 1; // +1 to include current miner
                        let selfish_share = 75; // 75% share for selfish miners
                        let selfless_share = 100 - selfish_share; // 25% share for selfless miners

                        let miner_payout = match miner.choice {
                            MinerChoice::Selfish => {
                                if mine.selfish_miners > 0 {
                                    (mine.mineral_payout
                                        * selfish_share
                                        / (100 * total_miners.into()))
                                        .into()
                                } else {
                                    0
                                }
                            },
                            MinerChoice::Selfless => {
                                if mine.selfless_miners > 0 {
                                    (mine.mineral_payout
                                        * selfless_share
                                        / (100 * total_miners.into()))
                                        .into()
                                } else {
                                    0
                                }
                            },
                            MinerChoice::None => {
                                assert(false, 'Invalid choice');
                                0
                            },
                        };
                        get_mineral(world).mint_from(get_caller_address(), miner_payout.into());
                    },
                    MineStatus::Collapsed => {
                        let mine1 = MineTrait::new(world);

                        set!(world, (mine1));
                    },
                }

                assert(
                    miner.last_checkup + TIME_BETWEEN_CHECKS < get_block_timestamp(), 'time not up'
                );
            },
            MineStatus::Mined => {
                miner.xp += 5;
                miner.status = MinerStatus::Idle;
                miner.mine_id = 0;
                miner.last_checkup = 0;

                match miner.choice {
                    MinerChoice::Selfish => { mine.selfish_miners -= 1; },
                    MinerChoice::Selfless => { mine.selfless_miners -= 1; },
                    MinerChoice::None => { assert(false, 'Invalid choice'); }
                }

                let total_miners = mine.selfish_miners
                    + mine.selfless_miners
                    + 1; // +1 to include current miner
                let selfish_share = 75; // 75% share for selfish miners
                let selfless_share = 100 - selfish_share; // 25% share for selfless miners

                let miner_payout = match miner.choice {
                    MinerChoice::Selfish => {
                        if mine.selfish_miners > 0 {
                            (mine.mineral_payout * selfish_share / (100 * total_miners.into()))
                                .into()
                        } else {
                            0
                        }
                    },
                    MinerChoice::Selfless => {
                        if mine.selfless_miners > 0 {
                            (mine.mineral_payout * selfless_share / (100 * total_miners.into()))
                                .into()
                        } else {
                            0
                        }
                    },
                    MinerChoice::None => {
                        assert(false, 'Invalid choice');
                        0
                    },
                };

                get_mineral(world).mint_from(get_caller_address(), miner_payout.into());
            },
            MineStatus::Collapsed => { assert(false, 'Mine is collapsed'); },
        }
    }
}
