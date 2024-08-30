import { useDojo } from "@/dojo/useDojo";
import { useMemo, useState } from "react";
import { useEntityQuery } from "@dojoengine/react";
import { Has, getComponentValue } from "@dojoengine/recs";
import { Button } from "@/components/ui/button";
import { MineCard } from "@/components/modules/MineCard";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAccount } from "@starknet-react/core";
import { Account } from "starknet";

import { motion } from "framer-motion";

function Mine() {
  const {
    setup: {
      client,
      contractComponents: { Mine },
    },
  } = useDojo();

  const mines = useEntityQuery([Has(Mine)]);

  const { account } = useAccount();

  const [filter, setFilter] = useState<"Open" | "Mined" | "Collapsed">("Open");

  const allMines = useMemo(() => {
    return mines
      .map((mine) => {
        return {
          ...getComponentValue(Mine, mine),
        };
      })
      .filter((mine) => {
        return mine.current_status?.toString() === filter && mine.id !== 0;
      });
  }, [mines, filter]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Mines</h1>

      <Button
        onClick={async () =>
          await client.actions.create_mine({ account: account as Account })
        }
      >
        Create mine
      </Button>

      <div className="mt-4">
        <ToggleGroup type="single">
          <ToggleGroupItem onClick={() => setFilter("Open")} value="c">
            Active
          </ToggleGroupItem>
          <ToggleGroupItem onClick={() => setFilter("Mined")} value="a">
            Mined
          </ToggleGroupItem>
          <ToggleGroupItem onClick={() => setFilter("Collapsed")} value="b">
            Collapsed
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        {allMines.map((mine) => (
          <motion.div
            key={mine.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MineCard mine={mine as any} account={account as Account} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Mine;
