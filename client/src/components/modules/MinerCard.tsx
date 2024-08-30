import { MinerClass } from "@/classes/MinerClass";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

import React, { useMemo } from "react";
import { getTimeAgo } from "@/lib/utils";

export const MinerCard = ({
  miner,
  children,
}: {
  miner: MinerClass;
  children?: React.ReactNode;
}) => {
  const isMining = useMemo(
    () => Number(miner.miner.mine_id) !== 0 && miner.isAlive(),
    [miner]
  );

  return (
    <Card className="group">
      <CardHeader>
        <CardTitle>
          <div className="flex gap-4">
            <img
              className={`w-16 h-16 rounded ${
                isMining ? "animate-bounce" : ""
              } `}
              src={miner.avatar()}
              alt=""
            />
            <div className="">
              <div className="flex gap-2">
                <Badge
                  className="mb-2"
                  variant={miner.isAlive() ? "default" : "destructive"}
                >
                  {" "}
                  {miner.status()}
                </Badge>
              </div>
              <div className=" font-arbutus">{miner.name()}</div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>
          GEAR LEVEL: <b>{miner.miner.gear_level}</b>
        </CardDescription>

        <CardDescription>
          XP: <b>{miner.miner.xp}</b>
        </CardDescription>

        <CardDescription>
          AGE: <b>{miner.age()} minutes</b>
        </CardDescription>

        {children}
      </CardContent>
      <CardFooter className="flex text-xs">
        {miner.isAlive() && (
          <Badge className="mb-2" variant={"outline"}>
            {Number(miner.miner.last_checkup) !== 0
              ? miner.currentMine().name() +
                "|" +
                getTimeAgo(miner.miner.last_checkup)
              : "Idle"}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};
