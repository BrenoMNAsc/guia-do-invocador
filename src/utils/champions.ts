import championsRaw from "../constants/raws/champion.json";

export type Lane = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

export type ChampionLite = {
  id: string;
  key: string;
  name: string;
  tags: string[];
  role: Lane;
};

type ByKey = Record<string, ChampionLite>;
type ById = Record<string, ChampionLite>;
type ByName = Record<string, ChampionLite>;

const data: Record<string, any> = (championsRaw as any).data;

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const JUNGLE_IDS = new Set<string>([
  "Amumu",
  "Belveth",
  "Briar",
  "Diana",
  "Ekko",
  "Elise",
  "Evelynn",
  "Fiddlesticks",
  "Gragas",
  "Graves",
  "Hecarim",
  "Ivern",
  "JarvanIV",
  "Jax",
  "Karthus",
  "Kayn",
  "Kindred",
  "KhaZix",
  "LeeSin",
  "Lillia",
  "Maokai",
  "MasterYi",
  "Nidalee",
  "Nocturne",
  "Nunu",
  "Olaf",
  "Rammus",
  "RekSai",
  "Rengar",
  "Sejuani",
  "Shaco",
  "Shyvana",
  "Skarner",
  "Taliyah",
  "Udyr",
  "Vi",
  "Viego",
  "Volibear",
  "Warwick",
  "Zac",
]);

function suggestRole(tags: string[], id: string): Lane {
  if (JUNGLE_IDS.has(id)) return "JUNGLE";
  if (tags.includes("Support")) return "SUPPORT";
  if (tags.includes("Marksman")) return "ADC";
  if (tags.includes("Assassin") || tags.includes("Mage")) return "MID";
  return "TOP";
}

export const CHAMPIONS_BY_KEY: ByKey = {};
export const CHAMPIONS_BY_ID: ById = {};
export const CHAMPIONS_BY_NAME: ByName = {};

for (const k of Object.keys(data)) {
  const c = data[k];
  const lite: ChampionLite = {
    id: c.id,
    key: c.key,
    name: c.name,
    tags: c.tags,
    role: suggestRole(c.tags ?? [], c.id),
  };

  CHAMPIONS_BY_KEY[lite.key] = lite;
  CHAMPIONS_BY_ID[lite.id] = lite;
  CHAMPIONS_BY_NAME[norm(lite.name)] = lite;
}

export function getChampion(query: string | number): ChampionLite | undefined {
  if (typeof query === "number" || /^\d+$/.test(String(query))) {
    return CHAMPIONS_BY_KEY[String(query)];
  }
  return CHAMPIONS_BY_ID[query] ?? CHAMPIONS_BY_NAME[norm(query)];
}
