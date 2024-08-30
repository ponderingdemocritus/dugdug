import { ContractComponents } from "@/dojo/bindings/typescript/models.gen";
import { SetupResult } from "@/dojo/setup";
import { Entity, getComponentValue } from "@dojoengine/recs";
import { MineClass } from "./MineClass";

export class MinerClass {
  public miner: ContractComponents["Miner"]["schema"];
  private setup: SetupResult;

  constructor(
    miner: ContractComponents["Miner"]["schema"],
    setup: SetupResult
  ) {
    this.miner = miner;
    this.setup = setup;
  }

  lastCheckup(): string {
    return new Date(this.miner.last_checkup * 1000).toLocaleString();
  }

  currentMine(): MineClass {
    const mine = getComponentValue(
      this.setup.contractComponents.Mine,
      this.setup.torii.poseidonHash([this.miner.mine_id.toString()]) as Entity
    );
    return new MineClass(mine as any);
  }

  age(): number {
    const currentTime = Math.floor(Date.now() / 1000);
    const ageInSeconds = currentTime - this.miner.birthtime;
    return Math.floor(ageInSeconds / 60);
  }

  status(): string {
    if (
      this.currentMine().mine &&
      this.currentMine().mine.current_status.toString() === "Collapsed"
    ) {
      return "Dead";
    } else {
      return "Alive";
    }
  }

  isAlive(): boolean {
    return this.status() === "Alive";
  }

  avatar(): string {
    const avatarValues = Object.values(AvatarPath).filter((v) =>
      isNaN(Number(v))
    ) as string[];

    const seed = BigInt(this.miner.seed);
    const avatarIndex = Number(seed % BigInt(avatarValues.length));

    return avatarValues[avatarIndex];
  }

  name(): string {
    const adjectiveValues = Object.values(DwarfFirstName).filter((v) =>
      isNaN(Number(v))
    ) as string[];
    const materialValues = Object.values(DwarfMiddleName).filter((v) =>
      isNaN(Number(v))
    ) as string[];
    const locationValues = Object.values(DwarfLastName).filter((v) =>
      isNaN(Number(v))
    ) as string[];

    const seed = BigInt(this.miner.seed);

    const firstName =
      adjectiveValues[Number(seed % BigInt(adjectiveValues.length))];

    const middleName =
      materialValues[Number(seed % BigInt(materialValues.length))];

    const lastName =
      locationValues[Number(seed % BigInt(locationValues.length))];

    return `${firstName} ${middleName} ${lastName}`;
  }
}

enum AvatarPath {
  Dwarf01 = "./dwarf_01.png",
  Dwarf02 = "./dwarf_02.png",
  Dwarf03 = "./dwarf_03.png",
  Dwarf04 = "./dwarf_04.png",
  Dwarf05 = "./dwarf_05.png",
  Dwarf06 = "./dwarf_06.png",
  Dwarf07 = "./dwarf_07.png",
  Dwarf08 = "./dwarf_08.png",
  Dwarf09 = "./dwarf_09.png",
  Dwarf10 = "./dwarf_10.png",
  Dwarf11 = "./dwarf_11.png",
  Dwarf12 = "./dwarf_12.png",
  Dwarf13 = "./dwarf_13.png",
  Dwarf14 = "./dwarf_14.png",
  Dwarf15 = "./dwarf_15.png",
  Dwarf16 = "./dwarf_16.png",
  Dwarf17 = "./dwarf_17.png",
  Dwarf18 = "./dwarf_18.png",
  Dwarf19 = "./dwarf_19.png",
  Dwarf20 = "./dwarf_20.png",
  Dwarf21 = "./dwarf_21.png",
  Dwarf22 = "./dwarf_22.png",
  Dwarf23 = "./dwarf_23.png",
  Dwarf24 = "./dwarf_24.png",
  Dwarf25 = "./dwarf_25.png",
  Dwarf26 = "./dwarf_26.png",
  Dwarf27 = "./dwarf_27.png",
  Dwarf28 = "./dwarf_28.png",
  Dwarf29 = "./dwarf_29.png",
  Dwarf30 = "./dwarf_30.png",
  Dwarf31 = "./dwarf_31.png",
  Dwarf32 = "./dwarf_32.png",
  Dwarf33 = "./dwarf_33.png",
  Dwarf34 = "./dwarf_34.png",
  Dwarf35 = "./dwarf_35.png",
  Dwarf36 = "./dwarf_36.png",
  Dwarf37 = "./dwarf_37.png",
  Dwarf38 = "./dwarf_38.png",
  Dwarf39 = "./dwarf_39.png",
  Dwarf40 = "./dwarf_40.png",
  Dwarf41 = "./dwarf_41.png",
  Dwarf42 = "./dwarf_42.png",
  Dwarf43 = "./dwarf_43.png",
  Dwarf44 = "./dwarf_44.png",
  Dwarf45 = "./dwarf_45.png",
  Dwarf46 = "./dwarf_46.png",
  Dwarf47 = "./dwarf_47.png",
  Dwarf48 = "./dwarf_48.png",
}

enum DwarfFirstName {
  Grumble,
  Stubby,
  Pebble,
  Nugget,
  Pickaxe,
  Rumble,
  Beardling,
  Chuckle,
  Gravel,
  Stumpy,
  Munchkin,
  Boulderhead,
  Twinkletoes,
  Snorkel,
  Wobble,
  Giggles,
  Bumble,
  Sneezy,
  Grumpy,
  Doodle,
}

enum DwarfMiddleName {
  Rockbiter,
  Gemhugger,
  Tunnelsniff,
  Cavecrawler,
  Beardtangle,
  Stonelicker,
  Mushroomchewer,
  Crystalgazer,
  Molewhisper,
  Lanternbelly,
  Axepolisher,
  Minecarttipper,
  Stalactitedodger,
  Orewhisperer,
  Picklebarrel,
  Rubbleroller,
  Mosschin,
  Pebbleskipper,
  Beerbelcher,
  Candlewick,
}

enum DwarfLastName {
  Stonepants,
  Ironbeard,
  Goldnose,
  Silverfist,
  Copperbottom,
  Diamondeyes,
  Rubyfeet,
  Sapphiretoes,
  Emeraldgut,
  Obsidianhead,
  Granitechin,
  Marblecheeks,
  Quartzknuckle,
  Coalbelly,
  Crystalears,
  Geodeknees,
  Amethystbrow,
  Pearlteeth,
  Opalfingers,
  Jadebelly,
}
