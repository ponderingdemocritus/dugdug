import { useMemo } from "react";

import { useDojo } from "@/dojo/useDojo";

import { useComponentValue } from "@dojoengine/react";

import { uint256 } from "starknet";
import { Entity } from "@dojoengine/recs";
import { useAccount } from "@starknet-react/core";
import { getContractByName } from "@dojoengine/core";
import { dojoConfig } from "../../dojoConfig";

export const useBalances = ({ address }: { address?: string | null } = {}) => {
  const {
    setup: {
      contractComponents: { ERC20BalanceModel },
      torii,
    },
  } = useDojo();

  const { account } = useAccount();
  const effectiveAddress = address || account?.address || "0";

  const axe = getContractByName(dojoConfig.manifest, "dugdug", "Axe")?.address;

  const mineral = getContractByName(
    dojoConfig.manifest,
    "dugdug",
    "Mineral"
  )?.address;

  const axeBalance = useComponentValue(
    ERC20BalanceModel,
    torii.poseidonHash([axe, effectiveAddress]) as Entity
  );

  const mineralModel = useComponentValue(
    ERC20BalanceModel,
    torii.poseidonHash([mineral, effectiveAddress]) as Entity
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
