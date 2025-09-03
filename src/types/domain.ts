export type Role = "Top" | "Jungle" | "Mid" | "ADC" | "Support";

export type Build = {
  title: string;
  winRate: number;
  pickRate: number;
  runes: string[];
  items: string[];
  skills: string; // "Q>W>E>..."
};

export type Champion = {
  id: string;
  name: string;
  role: Role;
  portrait: string; // URL
  builds: Build[];
};
