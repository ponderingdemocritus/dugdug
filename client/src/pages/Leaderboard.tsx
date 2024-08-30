import { MineClass } from "@/classes/MineClass";
import { useDojo } from "@/dojo/useDojo";
import { useEntityQuery } from "@dojoengine/react";
import { Has, HasValue, getComponentValue } from "@dojoengine/recs";
import { useMemo, useState } from "react";
import { num } from "starknet";
import { useAccount } from "@starknet-react/core";

function Leaderboard() {
  const {
    setup: {
      contractComponents: { Mine },
    },
  } = useDojo();

  const killCount = useEntityQuery([
    Has(Mine),
    HasValue(Mine, { current_status: "Collapsed" }),
  ]);

  const { account } = useAccount();

  const collapsedMines = useMemo(() => {
    const mineClasses = killCount.map((mine) => {
      const mineFormat = getComponentValue(Mine, mine);
      return new MineClass(mineFormat as any);
    });

    const deadMinersByLastMiner = mineClasses.reduce((acc, mineClass) => {
      const lastMiner = mineClass.mine.last_miner.toString();
      const deadMiners = mineClass.numberDeadMiners();

      if (!acc[lastMiner]) {
        acc[lastMiner] = 0;
      }
      acc[lastMiner] += deadMiners;

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deadMinersByLastMiner)
      .map(([lastMiner, deadMiners]) => ({ lastMiner, deadMiners }))
      .sort((a, b) => b.deadMiners - a.deadMiners);
  }, [killCount]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dwarf Kill Count</h1>
      <table className="min-w-full  text-left">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Rank</th>
            <th className="py-2 px-4 border-b">Player</th>
            <th className="py-2 px-4 border-b">Dead Miners</th>
          </tr>
        </thead>
        <tbody>
          {collapsedMines.map((mine, index) => (
            <tr key={mine.lastMiner} className="hover:bg-gray-900">
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">
                {BigInt(account?.address || "0") === BigInt(mine.lastMiner)
                  ? "You"
                  : num.toHexString(mine.lastMiner).slice(-8)}
              </td>
              <td className="py-2 px-4 border-b">{mine.deadMiners}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
