use dojo::world::IWorldDispatcherTrait;
use starknet::{
    ContractAddress, get_caller_address, get_block_hash_syscall, get_block_number,
    get_block_timestamp
};
use starknet::SyscallResultTrait;

use dugdug::events::{MinerSpawned, MineUpdate, MineralFound};

use core::poseidon::{PoseidonTrait, HashState};
use core::hash::HashStateTrait;

use alexandria_math::fast_root::fast_sqrt;

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Mine {
    #[key]
    pub id: u32,
    pub current_status: MineStatus,
    pub mining_state: u32,
    pub selfless_miners: u32,
    pub selfish_miners: u32,
    pub stability: u32,
    pub efficiency: u32,
    pub seed: u128,
    pub mineral_payout: u64,
    pub last_miner: ContractAddress,
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
pub struct Miner {
    #[key]
    pub id: u32,
    pub owner: ContractAddress,
    pub xp: u32,
    pub health: MinerHealth,
    pub gear_level: GearLevel,
    pub status: MinerStatus,
    pub choice: MinerChoice,
    pub last_checkup: u64,
    pub entered_mine: u64,
    pub mine_id: u32,
    pub seed: u128,
    pub birthtime: u64,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum MinerHealth {
    Dead,
    Alive,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum MinerStatus {
    Idle,
    Mining,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum MineStatus {
    Open,
    Mined,
    Collapsed,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum MinerChoice {
    None,
    Selfless,
    Selfish,
}

#[derive(Copy, Drop, Serde, Introspect)]
pub enum GearLevel {
    Wooden,
    Stone,
    ColdIron,
    Diamond,
    Adamantium
}


#[generate_trait]
impl MinerImpl of MinerTrait {
    fn new(world: dojo::world::IWorldDispatcher) -> Miner {
        let miner = Miner {
            id: world.uuid(),
            owner: get_caller_address(),
            xp: 0,
            health: MinerHealth::Alive,
            gear_level: GearLevel::Wooden,
            status: MinerStatus::Idle,
            choice: MinerChoice::None,
            mine_id: 0,
            last_checkup: 0,
            entered_mine: 0,
            seed: generate_seed() + world.uuid().into(),
            birthtime: get_block_timestamp(),
        };

        emit!(world, MinerSpawned { id: world.uuid(), time: get_block_timestamp(), miner });
        miner
    }
    fn mining_speed(self: Miner) -> u32 {
        match self.gear_level {
            GearLevel::Wooden => 1,
            GearLevel::Stone => 2,
            GearLevel::ColdIron => 3,
            GearLevel::Diamond => 4,
            GearLevel::Adamantium => 5,
        }
    }
}

#[generate_trait]
impl MineImpl of MineTrait {
    fn new(world: dojo::world::IWorldDispatcher) -> Mine {
        let mine = Mine {
            id: world.uuid(),
            current_status: MineStatus::Open,
            mining_state: 0,
            selfless_miners: 0,
            selfish_miners: 0,
            stability: 10000,
            efficiency: 10000,
            seed: generate_seed() + world.uuid().into(),
            mineral_payout: 0,
            last_miner: get_caller_address(),
        };

        emit!(world, MineUpdate { id: world.uuid(), time: get_block_timestamp(), mine });

        mine
    }
    fn check_mine_state(
        ref self: Mine, world: dojo::world::IWorldDispatcher, miner_choice: MinerChoice
    ) {
        let seed = generate_seed();

        // Update miner counts

        let total_miners = self.selfless_miners + self.selfish_miners;

        // Calculate collapse chance
        let base_collapse_chance = 500; // 5%
        let miner_impact = (total_miners * 300) / 2; // 3% increase per miner
        let selfish_impact = (self.selfish_miners * 500)
            / max(total_miners, 1); // Up to 30% increase based on selfish ratio
        let collapse_chance = min(
            base_collapse_chance + miner_impact + selfish_impact, 6000
        ); // Max 60%

        // Calculate yield chance
        let base_yield_chance = 1000; // 10%
        let miner_bonus = min((total_miners * 100), 1000); // Up to 20% increase
        let selfless_bonus = (self.selfish_miners * 200)
            / max(total_miners, 1); // Up to 20% increase based on selfless ratio
        let yield_chance = min(base_yield_chance + miner_bonus + selfless_bonus, 5000); // Max 50%

        let random_value = seed % 10000;

        if random_value < collapse_chance.into() {
            self.current_status = MineStatus::Collapsed;
        } else if random_value < (collapse_chance + yield_chance).into() {
            self.current_status = MineStatus::Mined;

            let base_payout = 1000; // Base payout of 1000
            let max_bonus = 100000; // Maximum bonus of 100000
            let bonus = (seed / 100000) % max_bonus; // Use a different part of the seed for bonus
            self.mineral_payout = (base_payout + bonus).try_into().unwrap();
        }

        self.last_miner = get_caller_address();

        emit!(world, MineUpdate { id: world.uuid(), time: get_block_timestamp(), mine: self });
    }
}

fn reseed(lhs: felt252, rhs: felt252) -> felt252 {
    let state: HashState = PoseidonTrait::new();
    let state = state.update(lhs);
    let state = state.update(rhs);
    state.finalize()
}

// TODO: Implement true VRF
fn generate_seed() -> u128 {
    let seed: u256 = reseed(get_block_timestamp().into(), get_block_timestamp().into()).into();

    seed.low
}

fn min(a: u32, b: u32) -> u32 {
    if a < b {
        a
    } else {
        b
    }
}

fn max(a: u32, b: u32) -> u32 {
    if a > b {
        a
    } else {
        b
    }
}


fn collapse_chance(selfless_miners: u32, selfish_miners: u32) -> u32 {
    let total_miners = selfless_miners + selfish_miners;
    let base_collapse_chance = 500; // 5%
    let miner_impact = (total_miners * 100) / 10; // 1% increase per miner
    let selfish_impact = (selfish_miners * 200)
        / max(total_miners, 1); // Up to 20% increase based on selfish ratio
    min(base_collapse_chance + miner_impact + selfish_impact, 6000) // Max 60%
}

fn yield_chance(selfless_miners: u32, selfish_miners: u32) -> u32 {
    let total_miners = selfless_miners + selfish_miners;
    let base_yield_chance = 1000; // 10%
    let miner_bonus = min((total_miners * 100), 2000); // Up to 20% increase
    let selfless_bonus = (selfless_miners * 200)
        / max(total_miners, 1); // Up to 20% increase based on selfless ratio
    min(base_yield_chance + miner_bonus + selfless_bonus, 5000) // Max 50%
}

#[cfg(test)]
mod tests {
    // import world dispatcher
    use super::{collapse_chance, yield_chance};

    #[test]
    fn test_yeild() {
        assert_eq!(yield_chance(0, 0), 1000);
        assert_eq!(yield_chance(1, 0), 1200);
        assert_eq!(yield_chance(0, 1), 1000);
        assert_eq!(yield_chance(1, 1), 1400);
        assert_eq!(yield_chance(10, 0), 3000);
        assert_eq!(yield_chance(0, 10), 1000);
        assert_eq!(yield_chance(10, 10), 4000);
    }
}
