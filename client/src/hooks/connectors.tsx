import { Connector } from "@starknet-react/core";
import CartridgeConnector from "@cartridge/connector";
import { getContractByName } from "@dojoengine/core";
import { dojoConfig } from "../../dojoConfig";

export const getConnectors = (): { connectors: Connector[] } => {
  const actions = getContractByName(
    dojoConfig.manifest,
    "dugdug",
    "actions"
  )?.address;

  const paymaster = { caller: "0x414e595f43414c4c4552" };
  const options = { paymaster };

  const cartridge = new CartridgeConnector({
    paymaster,
    policies: [
      {
        target: actions,
        method: "spawn_miner",
      },
      {
        target: actions,
        method: "buy_axe",
      },
      {
        target: actions,
        method: "check_mining",
      },
      {
        target: actions,
        method: "leave_mine",
      },
      {
        target: actions,
        method: "create_mine",
      },
      {
        target: actions,
        method: "start_mining",
      },
    ],
  }) as never as Connector;
  return { connectors: [cartridge] };
};
