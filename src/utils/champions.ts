// src/data/champions.map.ts
// Gere um import/require para o seu caminho real:
import championsRaw from "../constants/raws/champion.json";

export type Lane = "TOP" | "JUNGLE" | "MID" | "ADC" | "SUPPORT";

export type ChampionLite = {
  /** “id” curto, ex.: "Aatrox" */
  id: string;
  /** “key” numérica em string, ex.: "266" */
  key: string;
  /** nome localiz. ex.: "Aatrox" */
  name: string;
  /** classes originais do LoL, ex.: ["Fighter","Tank"] */
  tags: string[];
  /** role sugerida para filtros: */
  role: Lane;
};

type ByKey = Record<string, ChampionLite>; // por key numérica ("266")
type ById = Record<string, ChampionLite>; // por id curto ("Aatrox")
type ByName = Record<string, ChampionLite>; // por nome normalizado ("aatrox")

const data: Record<string, any> = (championsRaw as any).data;

/**
 * Normaliza nomes pt-BR: remove acento e deixa minúsculo.
 */
const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Overrides pontuais para campeões que jogam majoritariamente na Jungle
 * (como o JSON não traz “lane” oficial, usamos uma heurística + overrides).
 */
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

/**
 * Regras simples para mapear classes (“tags”) → role sugerida.
 * - “Support” → SUPPORT
 * - “Marksman” → ADC
 * - Jungle override → JUNGLE
 * - “Assassin”/“Mage” → MID
 * - “Tank”/“Fighter” → TOP
 */
function suggestRole(tags: string[], id: string): Lane {
  if (JUNGLE_IDS.has(id)) return "JUNGLE";
  if (tags.includes("Support")) return "SUPPORT";
  if (tags.includes("Marksman")) return "ADC";
  if (tags.includes("Assassin") || tags.includes("Mage")) return "MID";
  return "TOP"; // fallback comum para Fighter/Tank
}

/** Mapas resultantes */
export const CHAMPIONS_BY_KEY: ByKey = {};
export const CHAMPIONS_BY_ID: ById = {};
export const CHAMPIONS_BY_NAME: ByName = {};

/** Construção dos mapas */
for (const k of Object.keys(data)) {
  const c = data[k];
  const lite: ChampionLite = {
    id: c.id, // ex.: "Aatrox"
    key: c.key, // ex.: "266"
    name: c.name, // ex.: "Aatrox"
    tags: c.tags, // ex.: ["Fighter"]
    role: suggestRole(c.tags ?? [], c.id),
  };

  // Acesso por key numérica (string), por id curto e por nome normalizado:
  CHAMPIONS_BY_KEY[lite.key] = lite;
  CHAMPIONS_BY_ID[lite.id] = lite;
  CHAMPIONS_BY_NAME[norm(lite.name)] = lite;
}

/** Helpers de acesso flexíveis */
export function getChampion(query: string | number): ChampionLite | undefined {
  // se for número (ou numérico em string) → key
  if (typeof query === "number" || /^\d+$/.test(String(query))) {
    return CHAMPIONS_BY_KEY[String(query)];
  }
  // tenta por id curto primeiro (case-sensitive), depois por nome normalizado
  return CHAMPIONS_BY_ID[query] ?? CHAMPIONS_BY_NAME[norm(query)];
}
