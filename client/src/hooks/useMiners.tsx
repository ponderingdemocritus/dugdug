import { Button } from "@/components/ui/button";
import { useDojo } from "@/dojo/useDojo";
import { useMemo, useState } from "react";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import {
  defineComponent,
  Type as RecsType,
  Has,
  getComponentValue,
  HasValue,
} from "@dojoengine/recs";
import { MinerClass } from "@/classes/MinerClass";

export const useMiners = () => {
  const {
    setup: {
      client,
      contractComponents: { Miner, Mine },
    },
    account,
  } = useDojo();

  const { setup } = useDojo();

  const myMiners = useEntityQuery([
    Has(Miner),
    HasValue(Miner, { owner: BigInt(account.account?.address || "0") }),
  ]);

  const allMiners = useMemo(() => {
    return myMiners.map((miner) => {
      const minerFormat = getComponentValue(Miner, miner);

      const minerClass = new MinerClass(minerFormat as any, setup);
      return {
        minerClass,
      };
    });
  }, [myMiners]);

  const myAliveMiners = useMemo(() => {
    return allMiners.filter((miner) => miner.minerClass.status() === "Alive");
  }, [allMiners]);

  const myDeadMiners = useMemo(() => {
    return allMiners.filter((miner) => miner.minerClass.status() === "Dead");
  }, [allMiners]);

  return {
    allMiners,
    myAliveMiners,
    myDeadMiners,
  };
};
