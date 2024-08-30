import { MineClass } from "@/classes/MineClass";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ContractComponents,
  MinerHealthDefinition,
  MinerHealth,
} from "@/dojo/bindings/typescript/models.gen";
import { Button } from "../ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { MinerCard } from "@/components/modules/MinerCard";
import { useMiners } from "@/hooks/useMiners";
import { useDojo } from "@/dojo/useDojo";
import { Switch } from "@/components/ui/switch";
import { useMemo, useState } from "react";
import useImage from "@/hooks/useImage";
import { Badge } from "../ui/badge";
import { useUiSounds } from "@/hooks/useSound";
import { useBalances } from "@/hooks/useBalances";
import { useAccount } from "@starknet-react/core";

import Axe from "@/components/icons/axe.svg?react";
import { Account, num, shortString } from "starknet";

export const MineCard = ({
  mine,
  account,
}: {
  mine: ContractComponents["Mine"]["schema"];
  account: Account;
}) => {
  const {
    setup: { client },
  } = useDojo();

  const mineClass = new MineClass(mine);

  const { play } = useUiSounds();

  const { allMiners } = useMiners();

  const [choice, setChoice] = useState(false);

  const { readableAxeBalance } = useBalances();

  const [txLoading, setTxLoading] = useState(false);

  const { imageUrl, loading } = useImage(
    mine.seed.toString(),
    mineClass.name().replace(/\s+/g, "-")
  );

  const mineStatus = useMemo(() => {
    if (mine.current_status.toString() === "Mined") {
      return "secondary";
    } else if (mine.current_status.toString() === "Collapsed") {
      return "destructive";
    } else {
      return "outline";
    }
  }, [mine]);

  const miners = useMemo(() => {
    return allMiners.filter((a) => {
      const isMined = mine.current_status.toString() === "Mined";
      const isInMine = a.minerClass.miner.mine_id === mine.id;
      const isNotInMine = Number(a.minerClass.miner.mine_id) === 0;
      const isRecentlyChecked =
        (a.minerClass.miner.last_checkup || 0) * 1000 <=
        new Date().getTime() - 60 * 15 * 1000;

      if (isMined) {
        return isInMine;
      } else {
        return isNotInMine || (isInMine && isRecentlyChecked);
      }
    });
  }, [allMiners, mineClass, mine]);

  return (
    <Card>
      {loading ? (
        <CardContent className="self-center my-8">
          Mine being discovered...
        </CardContent>
      ) : (
        <>
          <div className="relative">
            <div className="top-4 left-4 absolute bg-black/50 px-2 rounded">
              <span className="uppercase  text-xs">Mineral Chance</span> <br />
              <span className="text-xl">
                {mineClass.calculateMineStatus().yieldChance} %
              </span>
            </div>
            <div className="top-4 right-4 absolute text-right px-2 rounded bg-black/50 ">
              <span className="uppercase  text-xs">Collapse Chance</span> <br />
              <span className="text-xl">
                {mineClass.calculateMineStatus().collapseChance} %
              </span>
            </div>
            {imageUrl && <img className="object-fill" src={imageUrl} alt="" />}
            <div className="absolute bottom-4 right-4 flex -space-x-4 hover:-space-x-2 ">
              {allMiners
                .filter(
                  (miner) =>
                    miner.minerClass.miner.mine_id === mine.id &&
                    Number(mine.id) !== 0
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
          </div>

          <CardHeader>
            <CardDescription className="mb-4 flex justify-between">
              <Badge variant={mineStatus}>{mine.current_status}</Badge>
              <Badge>$MINERAL: {mine.mineral_payout}</Badge>
            </CardDescription>

            <CardTitle className="text-2xl font-arbutus">
              {mineClass.name()}
            </CardTitle>

            <CardDescription className="text-sm">
              {mineClass.totalMiners()} miners
            </CardDescription>
            <CardDescription className="text-sm">
              Last Miner: ...
              {num.toHexString(mineClass.mine.last_miner.toString()).slice(-4)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mineClass.mine.current_status.toString() !== "Collapsed" &&
            miners.length ? (
              <Dialog>
                <DialogTrigger className="mt-4" asChild>
                  <Button variant="outline">
                    {mineClass.mine.current_status.toString() == "Mined"
                      ? "Withdraw"
                      : "Start Mining"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{mineClass.name()}</DialogTitle>
                    <DialogDescription>
                      Collapse Chance:{" "}
                      {mineClass.calculateMineStatus().collapseChance} %
                    </DialogDescription>

                    <DialogDescription>
                      Selfish Miner Bonus:{" "}
                      {mineClass.calculateMineStatus().selfishBonus} %
                    </DialogDescription>

                    <DialogDescription>
                      Mineral Chance:{" "}
                      {mineClass.calculateMineStatus().yieldChance} %
                    </DialogDescription>
                  </DialogHeader>
                  <Carousel className="w-full max-w-xs mx-auto">
                    <CarouselContent>
                      {miners.map((miner, index) => (
                        <CarouselItem key={index}>
                          <MinerCard
                            miner={miner.minerClass}
                            children={
                              <div className="mt-4">
                                {Number(miner.minerClass.miner.mine_id) ===
                                0 ? (
                                  <div className="w-full mb-4 flex gap-4">
                                    <Label
                                      className="self-center"
                                      htmlFor="email"
                                    >
                                      Be Selfish Yeild ++
                                    </Label>
                                    <Switch
                                      checked={choice}
                                      onCheckedChange={setChoice}
                                      aria-readonly
                                    />
                                    <Label
                                      className="self-center"
                                      htmlFor="email"
                                    >
                                      Be Selfless Stability ++
                                    </Label>
                                  </div>
                                ) : null}

                                {miner.minerClass.miner.health.toString() ===
                                  "Alive" &&
                                  mine.current_status.toString() !== "Mined" &&
                                  Number(miner.minerClass.miner.mine_id) ===
                                    0 &&
                                  Number(readableAxeBalance) > 0 && (
                                    <Button
                                      disabled={txLoading}
                                      className={txLoading ? "shake-small" : ""}
                                      onClick={async () => {
                                        setTxLoading(true);
                                        play();
                                        await client.actions.start_mining({
                                          account: account as Account,
                                          mine_id: mine.id,
                                          miner_id:
                                            miner.minerClass.miner.id || 0,
                                          choice: choice
                                            ? { type: "Selfless" }
                                            : { type: "Selfish" },
                                        });
                                        setTxLoading(false);
                                      }}
                                    >
                                      {txLoading ? "Mining..." : "Start Mining"}
                                    </Button>
                                  )}

                                {Number(readableAxeBalance) == 0 && (
                                  <Button
                                    disabled={txLoading}
                                    onClick={() =>
                                      client.actions.buy_axe({
                                        account: account as Account,
                                        qty: 10,
                                      })
                                    }
                                  >
                                    <Axe className="w-8 mr-3" />
                                    {txLoading ? "Buying..." : "Buy $AXE"}
                                  </Button>
                                )}

                                {miner.minerClass.miner.health.toString() ===
                                  "Alive" &&
                                  miner.minerClass.miner.mine_id ===
                                    mine.id && (
                                    <Button
                                      disabled={txLoading}
                                      variant={"destructive"}
                                      onClick={async () => {
                                        setTxLoading(true);
                                        await client.actions.leave_mine({
                                          account: account as Account,
                                          mine_id: mine.id,
                                          miner_id:
                                            miner.minerClass.miner.id || 0,
                                        });
                                        setTxLoading(false);
                                      }}
                                    >
                                      {txLoading ? "Leaving..." : "Leave Mine"}
                                    </Button>
                                  )}
                              </div>
                            }
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};
