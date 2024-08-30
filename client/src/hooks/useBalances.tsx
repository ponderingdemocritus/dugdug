import { useMemo } from "react";

import { useDojo } from "@/dojo/useDojo";

import { useComponentValue } from "@dojoengine/react";

import { uint256 } from "starknet";
import { Entity } from "@dojoengine/recs";
import { useAccount } from "@starknet-react/core";
import { getContractByName } from "@dojoengine/core";
import { dojoConfig } from "../../dojoConfig";
export const useBalances = () => {
  //   const { account } = useAccount();
  const {
    setup: {
      contractComponents: { ERC20BalanceModel },
      //   account: { account },
      torii,
    },
  } = useDojo();

  const { account } = useAccount();

  const axe = getContractByName(dojoConfig.manifest, "dugdug", "Axe")?.address;

  const mineral = getContractByName(
    dojoConfig.manifest,
    "dugdug",
    "Mineral"
  )?.address;

  const axeBalance = useComponentValue(
    ERC20BalanceModel,
    torii.poseidonHash([axe, account?.address || "0"]) as Entity
  );

  const mineralModel = useComponentValue(
    ERC20BalanceModel,
    torii.poseidonHash([mineral, account?.address || "0"]) as Entity
  );

  const parseAmount = (amount: string | undefined) => {
    if (!amount) return "0";
    // Convert hexadecimal to decimal and divide by 10^18
    const bigIntAmount = BigInt(`0x${amount}`);
    return (bigIntAmount / BigInt(10 ** 18)).toString();
  };

  const readableAxeBalance = useMemo(() => {
    return parseAmount(axeBalance?.amount as unknown as string);
  }, [axeBalance]);

  const readableMineralBalance = useMemo(() => {
    return parseAmount(mineralModel?.amount as unknown as string);
  }, [mineralModel]);

  return { readableAxeBalance, readableMineralBalance };
};
