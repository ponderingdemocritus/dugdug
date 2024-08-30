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

function Dashboard() {
  const {
    setup: {
      client,
      contractComponents: { MineUpdate, MinerSpawned },
    },
    account,
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
            <Card
              className="flex flex-col flex-wrap sm:flex-row"
              key={`${mineUpdate?.id}-${mineUpdate?.time}`}
            >
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
                            miner.minerClass.miner.mine_id === mineClass.mine.id
                        )
                        .map((miner, index) => (
                          <div key={index} className="relative">
                            <img
                              className={`w-10 h-10 rounded-full border transition-all duration-200 border-white/10  ${
                                miner.minerClass.status() === "Alive" &&
                                "animate-bounce"
                              }`}
                              src={miner.minerClass.avatar()}
                              alt=""
                            />
                            {miner.minerClass.status() === "Dead" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
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
                            miner.minerClass.miner.mine_id === mineClass.mine.id
                        )
                        .map((miner, index) => (
                          <div key={index} className="relative">
                            <img
                              className={`w-10 h-10 rounded-full border transition-all duration-200 border-white/10  ${
                                miner.minerClass.status() === "Alive" &&
                                "animate-bounce"
                              }`}
                              src={miner.minerClass.avatar()}
                              alt=""
                            />
                            {miner.minerClass.status() === "Dead" && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <svg
                                  className="w-6 h-6 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </CardContent>
                )}

                <CardFooter className="text-xs text-secondary-foreground">
                  {(() => {
                    const timeDifference =
                      Date.now() - (mineUpdate?.time || 0) * 1000;
                    const minutes = Math.floor(timeDifference / (1000 * 60));
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);

                    if (days > 0) {
                      return `${days} day${days > 1 ? "s" : ""} ago`;
                    } else if (hours > 0) {
                      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
                    } else {
                      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
                    }
                  })()}
                </CardFooter>
              </div>
            </Card>
          ),
        };
      })
      .sort((a, b) => {
        return (b.time || 0) - (a.time || 0);
      });
  }, [mine]);

  return (
    <div className="container mx-auto md:w-1/2">
      <h1 className="text-3xl font-bold mb-4">Activity Feed</h1>

      <div className="grid grid-cols-1 gap-6">
        {allEvents.map((event) => event.component)}
      </div>
    </div>
  );
}

export default Dashboard;
