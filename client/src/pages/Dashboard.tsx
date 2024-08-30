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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { MineClass } from "@/classes/MineClass";
import { getTimeAgo } from "@/lib/utils";
import Tombstone from "@/components/icons/tombstone.svg?react";

import { HaikuMessages } from "@/components/modules/MessagePrompt";

import { motion } from "framer-motion";

function Dashboard() {
  const {
    setup: {
      contractComponents: { MineUpdate, MinerSpawned },
    },
  } = useDojo();

  const { allMiners } = useMiners();

  const mine = useEntityQuery([Has(MineUpdate)]);
  const miners = useEntityQuery([Has(MinerSpawned)]);

  const allEvents = useMemo(() => {
    return mine
      .map((event) => {
        const mineUpdate = getComponentValue(MineUpdate, event);

        const mineClass = new MineClass(mineUpdate?.mine as any);

        return {
          time: mineUpdate?.time,
          component: (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              key={`${mineUpdate?.id}-${mineUpdate?.time}`}
            >
              <Card className="flex flex-col flex-wrap sm:flex-row">
                <img
                  src={`https://dugdugdug.s3.ap-northeast-1.amazonaws.com/images/image_${mineClass.mine.seed}.png`}
                  alt=""
                  className="rounded-l-xl object-cover md:w-1/6"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
                <div className="md:w-2/3">
                  <CardHeader className="font-arbutus">
                    {mineClass.name()}
                  </CardHeader>
                  {mineClass.mine.current_status.toString() === "Collapsed" ? (
                    <CardContent>
                      <p>
                        Mine {mineClass.name()} has collapsed killing{" "}
                        {mineClass.totalMiners()} miners
                      </p>
                      <div className="absolute bottom-4 right-4 flex -space-x-4 hover:-space-x-2 ">
                        {allMiners
                          .filter(
                            (miner) =>
                              miner.minerClass.miner.mine_id ===
                              mineClass.mine.id
                          )
                          .map((miner, index) => (
                            <div key={index} className="relative">
                              <img
                                className={`w-10 h-10 rounded-full border transition-all duration-200 border-white/10  ${
                                  miner.minerClass.status() === "Alive"
                                    ? "animate-bounce"
                                    : "grayscale"
                                }`}
                                src={miner.minerClass.avatar()}
                                alt=""
                              />
                              {miner.minerClass.status() === "Dead" && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <Tombstone />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  ) : mineClass.mine.current_status.toString() === "Mined" ? (
                    <CardContent>
                      <p>Mine {mineClass.name()} has been mined!!!!</p>
                    </CardContent>
                  ) : (
                    <CardContent>
                      <p>
                        Mine {mineClass.name()} has {mineClass.totalMiners()}{" "}
                        miners
                      </p>
                      <div className="absolute bottom-4 right-4 flex -space-x-4 hover:-space-x-2 ">
                        {allMiners
                          .filter(
                            (miner) =>
                              miner.minerClass.miner.mine_id ===
                              mineClass.mine.id
                          )
                          .map((miner, index) => (
                            <div key={index} className="relative">
                              <img
                                className={`w-10 h-10 rounded-full border transition-all duration-200 border-white/10  ${
                                  miner.minerClass.status() === "Alive"
                                    ? "animate-bounce"
                                    : "grayscale"
                                }`}
                                src={miner.minerClass.avatar()}
                                alt=""
                              />
                              {miner.minerClass.status() === "Dead" && (
                                <div className="absolute inset-0 flex items-center justify-center ">
                                  <Tombstone />
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  )}

                  <CardFooter className="text-xs text-secondary-foreground">
                    {getTimeAgo(mineUpdate?.time || 0)}
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          ),
        };
      })
      .sort((a, b) => {
        return (b.time || 0) - (a.time || 0);
      });
  }, [mine]);

  return (
    <div className="container mx-auto md:w-1/2">
      <h1 className="text-3xl font-bold mb-4 font-arbutus">Activity Feed</h1>
      {/* <HaikuMessages /> */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        {allEvents.map((event) => event.component)}
      </div>
    </div>
  );
}

export default Dashboard;
