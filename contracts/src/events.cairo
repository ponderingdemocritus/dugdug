use dugdug::models::{
    Miner, Mine, MineTrait, MinerTrait, MinerStatus, MineStatus, MinerChoice, GearLevel
};

#[derive(Copy, Drop, Serde)]
#[dojo::model]
#[dojo::event]
struct MinerSpawned {
    #[key]
    id: u32,
    time: u64,
    miner: Miner
}

#[derive(Copy, Drop, Serde)]
#[dojo::model]
#[dojo::event]
struct MineUpdate {
    #[key]
    id: u32,
    time: u64,
    mine: Mine
}


#[derive(Copy, Drop, Serde)]
#[dojo::model]
#[dojo::event]
struct MineralFound {
    #[key]
    id: u32,
    time: u64,
    mineral: u32
}

#[derive(Copy, Drop, Serde)]
#[dojo::event]
#[dojo::model(namespace: "haiku", nomapping: true)]
struct MineralFoundHaiku {
    #[key]
    id: u32,
    timestamp: u64,
    seed: u128,
    minerals: u64,
}
