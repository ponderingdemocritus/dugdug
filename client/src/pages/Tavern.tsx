import { Button } from "@/components/ui/button";
import { useDojo } from "@/dojo/useDojo";
import { useMemo, useState } from "react";
import { useComponentValue, useEntityQuery } from "@dojoengine/react";
import {
  defineComponent,
  Type as RecsType,
  Has,
  getComponentValue,
} from "@dojoengine/recs";
import { MinerCard } from "@/components/modules/MinerCard";
import { useMiners } from "@/hooks/useMiners";
import { useUiSounds } from "@/hooks/useSound";
import { motion } from "framer-motion";
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function Tavern() {
  const {
    setup: {
      client,
      contractComponents: { Mine },
    },
  } = useDojo();

  const { allMiners } = useMiners();

  const { account } = useAccount();

  const [filter, setFilter] = useState<"Dead" | "Alive">("Alive");

  const [isLoading, setIsLoading] = useState(false);

  const { play } = useUiSounds();

  const filteredMiners = useMemo(() => {
    return allMiners
      .filter((miner) => {
        return (
          miner.minerClass.status() === filter &&
          miner.minerClass.miner.owner.toString() ===
            BigInt(account?.address || "0").toString()
        );
      })
      .sort((a, b) => b.minerClass.miner.id - a.minerClass.miner.id); // Sort by miner ID in descending order
  }, [filter, allMiners]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 font-arbutus">
        The Tavern under the Mountain
      </h1>

      <Button
        className="mb-4"
        disabled={isLoading}
        onClick={async () => {
          setIsLoading(true);
          play();
          await client.actions.spawn_miner({ account: account as Account });
          setIsLoading(false);
        }}
      >
        {isLoading ? "Filling up Flagon...." : "Buy a round of drinks"}
      </Button>

      <div>
        <ToggleGroup type="single">
          <ToggleGroupItem onClick={() => setFilter("Alive")} value="a">
            Alive
          </ToggleGroupItem>
          <ToggleGroupItem onClick={() => setFilter("Dead")} value="c">
            Dead
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {filteredMiners.map((miner) => (
          <motion.div
            key={miner.minerClass.miner.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MinerCard
              miner={miner.minerClass as any}
              key={miner.minerClass.miner.id}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Tavern;
