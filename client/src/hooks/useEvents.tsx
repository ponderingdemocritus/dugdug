import { useDojo } from "@/dojo/useDojo";
import { Component, ComponentUpdate, World } from "@dojoengine/recs";
import { useEffect } from "react";
import { defineComponentSystem } from "@dojoengine/recs";
import { toast } from "sonner";
import { MineClass } from "@/classes/MineClass";
import { MinerClass } from "@/classes/MinerClass";
import { useUIStore } from "./state";

export const useEvents = () => {
  const {
    setup: {
      contractComponents: { MineUpdate, MinerSpawned },
      world,
    },
  } = useDojo();

  const { setup } = useDojo();

  const setModal = useUIStore((state) => state.setModal);
  const setModalContent = useUIStore((state) => state.setModalContent);

  const handleMineUpdate = (update: ComponentUpdate) => {
    const mineClass = new MineClass(update.value[0]?.mine as any);

    if (mineClass.mine.current_status.toString() === "Collapsed") {
      setModal(true);
      const content = `${mineClass.name()} has collapsed killing ${mineClass.totalMiners()} miners`;
      setModalContent(content, mineClass);
      toast(content);
    } else if (mineClass.mine.current_status.toString() === "Mined") {
      const content = `${mineClass.name()} has been mined!!!! Yielding ${
        mineClass.mine.mineral_payout
      } $MINERALS`;
      setModalContent(content, mineClass);
      setModal(true);
      toast(content);
    } else {
      toast(`${mineClass.name()} has ${mineClass.totalMiners()} miners`);
    }
  };

  const handleMinerSpawned = (update: ComponentUpdate) => {
    const minerClass = new MinerClass(update.value[0]?.miner as any, setup);
    toast(
      <div className="flex gap-4">
        <img className="w-10 h-10 rounded" src={minerClass.avatar()} alt="" />
        <div>{minerClass.name()} entered the Tavern</div>
      </div>
    );
  };

  const createEventStream = (
    world: World,
    component: Component<any>,
    handler: (update: ComponentUpdate) => void
  ) => {
    defineComponentSystem(
      world,
      component,
      (update: ComponentUpdate) => {
        console.log(update.value[0]?.time * 1000 <= Date.now() - 10000);
        if (update.value[0]?.time * 1000 <= Date.now() - 100000) {
          return;
        }
        handler(update);
      },
      { runOnInit: false }
    );
  };

  useEffect(() => {
    createEventStream(world, MineUpdate, handleMineUpdate);
    createEventStream(world, MinerSpawned, handleMinerSpawned);
  }, [world]);

  return {};
};
