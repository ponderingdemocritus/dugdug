import { ContractComponents } from "@/dojo/bindings/typescript/models.gen";

export class MineClass {
  public mine: ContractComponents["Mine"]["schema"];

  constructor(mine: ContractComponents["Mine"]["schema"]) {
    this.mine = mine;
  }

  totalMiners(): number {
    return this.mine.selfish_miners + this.mine.selfless_miners;
  }

  image(): string {
    return `https://dugdugdug.s3.ap-northeast-1.amazonaws.com/images/image_${this.mine.seed}.png`;
  }

  isCollapsed(): boolean {
    return this.mine.current_status.toString() === "Collapsed";
  }

  numberDeadMiners(): number {
    if (this.isCollapsed()) {
      return this.totalMiners();
    } else {
      return 0;
    }
  }

  payoutPerMinerType(): {
    selfish: number;
    selfless: number;
  } {
    const totalMiners = this.totalMiners();
    const selfishMiners = this.mine.selfish_miners;
    const selflessMiners = this.mine.selfless_miners;
    const payout = this.mine.mineral_payout;

    const selfishPayout = Math.floor(
      (payout * 0.75) / Math.max(selfishMiners, 1)
    );
    const selflessPayout = Math.floor(
      (payout * 0.25) / Math.max(selflessMiners, 1)
    );

    return {
      selfish: selfishPayout,
      selfless: selflessPayout,
    };
  }

  name(): string {
    const adjectiveValues = Object.values(MineAdjective).filter((v) =>
      isNaN(Number(v))
    ) as string[];
    const materialValues = Object.values(MineMaterial).filter((v) =>
      isNaN(Number(v))
    ) as string[];
    const locationValues = Object.values(MineLocation).filter((v) =>
      isNaN(Number(v))
    ) as string[];

    const seed = BigInt(this.mine.seed);

    const firstName =
      adjectiveValues[Number(seed % BigInt(adjectiveValues.length))];

    const middleName =
      materialValues[Number(seed % BigInt(materialValues.length))];

    const lastName =
      locationValues[Number(seed % BigInt(locationValues.length))];

    return `${firstName} ${middleName} ${lastName}`;
  }
  calculateMineStatus(): {
    status: MineStatus;
    payout: number;
    collapseChance: number;
    yieldChance: number;
    selfishBonus: number;
  } {
    const totalMiners = this.totalMiners();
    const selfishMiners = this.mine.selfish_miners;
    const selflessMiners = this.mine.selfless_miners;

    // Calculate collapse chance
    const baseCollapseChance = 500; // 5%
    const minerImpact = (totalMiners * 300) / 2; // 3% increase per miner
    const selfishImpact = Math.floor(
      (selfishMiners * 500) / Math.max(totalMiners, 1)
    ); // Up to 30% increase based on selfish ratio
    const collapseChance = Math.min(
      baseCollapseChance + minerImpact + selfishImpact,
      6000
    ); // Max 60%

    // Calculate yield chance
    const baseYieldChance = 1000; // 10%
    const minerBonus = Math.min(totalMiners * 100, 1000); // Up to 20% increase
    const selfishBonus = Math.floor(
      (selfishMiners * 200) / Math.max(totalMiners, 1)
    ); // Up to 20% increase based on selfless ratio
    const yieldChance = Math.min(
      baseYieldChance + minerBonus + selfishBonus,
      5000
    ); // Max 50%

    const randomValue = Number(BigInt(this.mine.seed.toString()) % 10000n);

    if (randomValue < collapseChance) {
      return {
        status: MineStatus.Collapsed,
        payout: 0,
        collapseChance: collapseChance / 100,
        yieldChance: yieldChance / 100,
        selfishBonus: selfishBonus / 100,
      };
    } else if (randomValue < collapseChance + yieldChance) {
      const basePayout = 1000; // Base payout of 1000
      const maxBonus = 100000; // Maximum bonus of 100000
      const bonus = Number(
        (BigInt(this.mine.seed.toString()) / 100000n) % BigInt(maxBonus)
      ); // Use a different part of the seed for bonus
      return {
        status: MineStatus.Mined,
        payout: this.mine.mineral_payout,
        collapseChance: collapseChance / 100,
        yieldChance: yieldChance / 100,
        selfishBonus: selfishBonus / 100,
      };
    } else {
      return {
        status: MineStatus.Active,
        payout: 0,
        collapseChance: collapseChance / 100,
        yieldChance: yieldChance / 100,
        selfishBonus: selfishBonus / 100,
      };
    }
  }
}

enum MineStatus {
  Active = "Active",
  Collapsed = "Collapsed",
  Mined = "Mined",
}

enum MineAdjective {
  Deep = "Deep",
  Ancient = "Ancient",
  Glittering = "Glittering",
  Echoing = "Echoing",
  Shadowy = "Shadowy",
  Mystic = "Mystic",
  Forgotten = "Forgotten",
  Whispering = "Whispering",
  Majestic = "Majestic",
  Enchanted = "Enchanted",
  Hidden = "Hidden",
  Sacred = "Sacred",
  Haunted = "Haunted",
  Silent = "Silent",
  Radiant = "Radiant",
  Gloomy = "Gloomy",
  Secret = "Secret",
  Lost = "Lost",
  Forbidden = "Forbidden",
  Mysterious = "Mysterious",
  Shimmering = "Shimmering",
  Dark = "Dark",
  Bright = "Bright",
}

enum MineMaterial {
  Gold = "Gold",
  Silver = "Silver",
  Diamond = "Diamond",
  Mithril = "Mithril",
  Crystal = "Crystal",
  Obsidian = "Obsidian",
  Emerald = "Emerald",
  Opal = "Opal",
}

enum MineLocation {
  Cavern = "Cavern",
  Depths = "Depths",
  Hollow = "Hollow",
  Chasm = "Chasm",
  Abyss = "Abyss",
  Labyrinth = "Labyrinth",
  Vault = "Vault",
  Gorge = "Gorge",
}
