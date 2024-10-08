import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDojo } from "@/dojo/useDojo";
import { Button } from "@/components/ui/button";
import { useComponentValue } from "@dojoengine/react";

import { Account, cairo, uint256 } from "starknet";
import { Entity } from "@dojoengine/recs";
import { useBalances } from "@/hooks/useBalances";
import { useAccount } from "@starknet-react/core";
import Axe from "@/components/icons/axe.svg?react";

import Diamond from "@/components/icons/diamond.svg?react";
import { getContractByName } from "@dojoengine/core";
import { dojoConfig } from "../../dojoConfig";

function Shop() {
  const {
    setup: { client },
    // account,
  } = useDojo();

  const { account } = useAccount();

  const { readableAxeBalance, readableMineralBalance } = useBalances();

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4 font-arbutus">Shop</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <Axe className="w-12" />{" "}
            <span className="text-3xl font-arbutus">
              {readableAxeBalance.toLocaleString()}{" "}
            </span>
            $AXE
          </CardHeader>

          <CardContent>
            <Button
              className="mt-8"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                await client.actions.buy_axe({
                  account: account as Account,
                  qty: 1,
                });
                setIsLoading(false);
              }}
            >
              {" "}
              Buy 1 $AXE <Axe className="w-8 ml-3" />
            </Button>

            <CardDescription className="mt-4">1 $AXE = 0.1ETH</CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Diamond className="w-12" />
            <span className="text-3xl  font-arbutus">
              {readableMineralBalance.toLocaleString()}{" "}
            </span>
            $MINERALS
          </CardHeader>

          <CardContent>
            <a
              target="_blank"
              href="https://game-jam.interface-9yz.pages.dev/dca?outputCurrency=ETH&inputCurrency=MINERAL&showOrders=active&amount=200000&duration=14272"
            >
              <Button
                className="mt-8"
                onClick={() =>
                  console.log("selling mineral", account as Account)
                }
              >
                Sell $MINERAL on EKUBO <Axe className="w-8 ml-3" />
              </Button>
            </a>{" "}
            <CardDescription className="mt-4">
              1 $MINERAL = 0.000001ETH
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Shop;
