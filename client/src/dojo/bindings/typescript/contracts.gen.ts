// Generated by dojo-bindgen on Wed, 28 Aug 2024 21:10:21 +0000. Do not modify this file manually.
// Import the necessary types from the recs SDK
// generate again with `sozo build --typescript`
import { Account, byteArray } from "starknet";
import { DojoProvider } from "@dojoengine/core";
import * as models from "./models.gen";

export type IWorld = Awaited<ReturnType<typeof setupWorld>>;

export async function setupWorld(provider: DojoProvider) {
  // System definitions for `dugdug-Axe` contract
  function Axe() {
    const contract_name = "Axe";

    // Call the `mint_from` system with the specified Account and calldata
    const mint_from = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "mint_from",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `transfer` system with the specified Account and calldata
    const transfer = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transfer",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `transfer_from` system with the specified Account and calldata
    const transfer_from = async (props: {
      account: Account;
      sender: bigint;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transfer_from",
            calldata: [
              props.sender,
              props.recipient,
              props.amount.low,
              props.amount.high,
            ],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `l2_bridge_address` system with the specified Account and calldata
    const l2_bridge_address = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "l2_bridge_address",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `mint` system with the specified Account and calldata
    const mint = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "mint",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `burn` system with the specified Account and calldata

    // Call the `name` system with the specified Account and calldata
    const name = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "name",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `symbol` system with the specified Account and calldata
    const symbol = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "symbol",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `decimals` system with the specified Account and calldata
    const decimals = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "decimals",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `totalSupply` system with the specified Account and calldata
    const totalSupply = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "totalSupply",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `world` system with the specified Account and calldata
    const world = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "world",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `total_supply` system with the specified Account and calldata
    const total_supply = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "total_supply",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `transferFrom` system with the specified Account and calldata
    const transferFrom = async (props: {
      account: Account;
      sender: bigint;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transferFrom",
            calldata: [
              props.sender,
              props.recipient,
              props.amount.low,
              props.amount.high,
            ],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `allowance` system with the specified Account and calldata
    const allowance = async (props: {
      account: Account;
      owner: bigint;
      spender: bigint;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "allowance",
            calldata: [props.owner, props.spender],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `approve` system with the specified Account and calldata
    const approve = async (props: {
      account: Account;
      spender: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "approve",
            calldata: [props.spender, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    return {
      mint_from,
      transfer,
      transfer_from,
      l2_bridge_address,
      mint,
      name,
      symbol,
      decimals,
      totalSupply,
      world,
      total_supply,
      transferFrom,
      allowance,
      approve,
    };
  }

  // System definitions for `dugdug-Mineral` contract
  function Mineral() {
    const contract_name = "Mineral";

    // Call the `transferFrom` system with the specified Account and calldata
    const transferFrom = async (props: {
      account: Account;
      sender: bigint;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transferFrom",
            calldata: [
              props.sender,
              props.recipient,
              props.amount.low,
              props.amount.high,
            ],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `name` system with the specified Account and calldata
    const name = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "name",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `symbol` system with the specified Account and calldata
    const symbol = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "symbol",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `decimals` system with the specified Account and calldata
    const decimals = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "decimals",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `allowance` system with the specified Account and calldata
    const allowance = async (props: {
      account: Account;
      owner: bigint;
      spender: bigint;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "allowance",
            calldata: [props.owner, props.spender],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `approve` system with the specified Account and calldata
    const approve = async (props: {
      account: Account;
      spender: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "approve",
            calldata: [props.spender, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `mint_from` system with the specified Account and calldata
    const mint_from = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "mint_from",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `l2_bridge_address` system with the specified Account and calldata
    const l2_bridge_address = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "l2_bridge_address",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `mint` system with the specified Account and calldata
    const mint = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "mint",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `world` system with the specified Account and calldata
    const world = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "world",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `transfer` system with the specified Account and calldata
    const transfer = async (props: {
      account: Account;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transfer",
            calldata: [props.recipient, props.amount.low, props.amount.high],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `transfer_from` system with the specified Account and calldata
    const transfer_from = async (props: {
      account: Account;
      sender: bigint;
      recipient: bigint;
      amount: models.U256;
    }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "transfer_from",
            calldata: [
              props.sender,
              props.recipient,
              props.amount.low,
              props.amount.high,
            ],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `total_supply` system with the specified Account and calldata
    const total_supply = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "total_supply",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `totalSupply` system with the specified Account and calldata
    const totalSupply = async (props: { account: Account }) => {
      try {
        return await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "totalSupply",
            calldata: [],
          },
          "dugdug"
        );
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    return {
      transferFrom,
      name,
      symbol,
      decimals,
      allowance,
      approve,
      mint_from,
      l2_bridge_address,
      mint,
      world,
      transfer,
      transfer_from,
      total_supply,
      totalSupply,
    };
  }

  // System definitions for `dugdug-actions` contract
  function actions() {
    const contract_name = "actions";

    // Call the `world` system with the specified Account and calldata
    const world = async (props: { account: Account }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "world",
            calldata: [],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `spawn_miner` system with the specified Account and calldata
    const spawn_miner = async (props: { account: Account }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "spawn_miner",
            calldata: [],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `buy_axe` system with the specified Account and calldata
    const buy_axe = async (props: { account: Account; qty: number }) => {
      console.log(props.account);
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "buy_axe",
            calldata: [props.qty],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `start_mining` system with the specified Account and calldata
    const start_mining = async (props: {
      account: Account;
      miner_id: number;
      mine_id: number;
      choice: models.MinerChoice;
    }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "start_mining",
            calldata: [
              props.miner_id,
              props.mine_id,
              ["None", "Selfless", "Selfish"].indexOf(props.choice.type),
            ],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `check_mining` system with the specified Account and calldata
    const check_mining = async (props: {
      account: Account;
      miner_id: number;
      mine_id: number;
    }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "check_mining",
            calldata: [props.miner_id, props.mine_id],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    // Call the `leave_mine` system with the specified Account and calldata
    const leave_mine = async (props: {
      account: Account;
      miner_id: number;
      mine_id: number;
    }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "leave_mine",
            calldata: [props.miner_id, props.mine_id],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };
    // Call the `create_mine` system with the specified Account and calldata
    const create_mine = async (props: { account: Account }) => {
      try {
        const result = await provider.execute(
          props.account,
          {
            contractName: contract_name,
            entrypoint: "create_mine",
            calldata: [],
          },
          "dugdug"
        );
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 2s delay
        return result;
      } catch (error) {
        console.error("Error executing spawn:", error);
        throw error;
      }
    };

    return {
      world,
      spawn_miner,
      buy_axe,
      start_mining,
      check_mining,
      leave_mine,
      create_mine,
    };
  }

  return {
    Axe: Axe(),
    Mineral: Mineral(),
    actions: actions(),
  };
}
