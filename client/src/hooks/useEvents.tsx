import { useDojo } from "@/dojo/useDojo";
import { useEntityQuery } from "@dojoengine/react";
import { Component, ComponentUpdate, Has, World } from "@dojoengine/recs";
import { useEffect, useMemo } from "react";
import {
  defineComponent,
  Type as RecsType,
  getComponentValue,
  defineComponentSystem,
} from "@dojoengine/recs";
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

  const modal = useUIStore((state) => state.modal);
  const setModal = useUIStore((state) => state.setModal);
  const setModalContent = useUIStore((state) => state.setModalContent);

  function createEventStream(world: World, component: Component<any>) {
    defineComponentSystem(world, component, (update: ComponentUpdate) => {
      if (update.value[0]?.time * 1000 <= Date.now() - 10000) {
        return;
      }

      if (update.component?.metadata?.name === "MineUpdate") {
        const mineClass = new MineClass(update.value[0]?.mine as any);

        if (mineClass.mine.current_status.toString() === "Collapsed") {
          setModal(true);

          const content = `${mineClass.name()} has collapsed killing ${mineClass.totalMiners()} miners`;

          setModalContent(content, mineClass);
          toast(content);
        } else if (mineClass.mine.current_status.toString() === "Mined") {
          const content = `${mineClass.name()} has been mined!!!! Yeilding ${
            mineClass.mine.mineral_payout
          } $MINERALS`;

          setModalContent(content, mineClass);
          setModal(true);
          toast(content);
        } else {
          toast(`${mineClass.name()} has ${mineClass.totalMiners()} miners`);
        }
      } else if (update.component?.metadata?.name === "MinerSpawned") {
        const minerClass = new MinerClass(update.value[0]?.miner as any, setup);

        toast(
          <div className="flex gap-4">
            <img
              className="w-10 h-10 rounded"
              src={minerClass.avatar()}
              alt=""
            />
            <div>{minerClass.name()} entered the Tavern</div>
          </div>
        );
      }
    });
  }

  useEffect(() => {
    return () => {
      createEventStream(world, MineUpdate);
      createEventStream(world, MinerSpawned);
    };
  }, [world]);

  return {};
};
