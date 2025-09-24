export type Role = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";
export type ChampionClass =
  | "Assassin"
  | "Fighter"
  | "Mage"
  | "Marksman"
  | "Support"
  | "Tank";

export type Item = {
  id: number | string;
  name: string;
  shortDescription: string;
  icon?: string;
};

export type Rune = {
  id: number | string;
  name: string;
  key: string;
  shortDescription?: string;
  icon?: string;
  styleId?: number;
  slot?: number;
};

export type BuildItems = {
  start: Array<number | string>;
  core: Array<number | string>;
  boots: Array<number | string>;
  optional: Array<number | string>;
};

export type BuildSpec = {
  id: string;
  title: string;
  role: Role;
  primaryStyle: number;
  secondaryStyle: number;
  runes: Array<number | string>;
  items: BuildItems;
  skillOrder: string;
  winRate: number;
  pickRate: number;
  isBest?: boolean;
};

export type Champion = {
  id: string;
  key: string;
  name: string;
  roles: Role[];
  classes: ChampionClass[];
  builds: BuildSpec[];
  searchKey: string;
};

export type Filter = {
  role?: Role;
  championClass?: ChampionClass;
  name?: string;
};

export type RootStackParamList = {
  Home: undefined;
  Champion: { championId: string };
  Map: undefined;
  Share: undefined;
};
