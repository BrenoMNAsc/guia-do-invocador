import type { Rune } from "../types/domain";

type RunesDb = Record<string | number, Rune>;

export const STYLE_IDS = {
  PRECISION: 8000,
  DOMINATION: 8100,
  SORCERY: 8200,
  INSPIRATION: 8300,
  RESOLVE: 8400,
} as const;

const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const KEYSTONES_BY_STYLE: Record<number, readonly string[]> = {
  [STYLE_IDS.PRECISION]: [
    "pressione o ataque",
    "press the attack",
    "presstheattack",
    "ritmo fatal",
    "lethal tempo",
    "lethaltempo",
    "pé veloz",
    "pe veloz",
    "fleet footwork",
    "fleetfootwork",
    "conquistador",
    "conqueror",
  ],
  [STYLE_IDS.DOMINATION]: [
    "eletrocutar",
    "electrocute",
    "colheita sombria",
    "dark harvest",
    "darkharvest",
    "chuva de lâminas",
    "chuva de laminas",
    "hail of blades",
    "hailofblades",
  ],
  [STYLE_IDS.SORCERY]: [
    "invocar aery",
    "summon aery",
    "summonaery",
    "cometa arcano",
    "arcane comet",
    "arcanecomet",
    "ímpeto gradual",
    "impeto gradual",
    "phase rush",
    "phaserush",
  ],
  [STYLE_IDS.INSPIRATION]: [
    "aprimoramento glacial",
    "glacial augment",
    "glacialaugment",
    "primeiro ataque",
    "first strike",
    "firststrike",
    "livro de feitiços",
    "unsealed spellbook",
    "unsealedspellbook",
  ],
  [STYLE_IDS.RESOLVE]: [
    "agarrar do perpétuo",
    "agarrar do perpetuo",
    "grasp of the undying",
    "graspoftheundying",
    "pós-choque",
    "pos-choque",
    "pos choque",
    "aftershock",
    "guardião",
    "guardiao",
    "guardian",
  ],
};

function guessStyleIdByKeystoneName(keystoneNameOrKey?: string) {
  if (!keystoneNameOrKey) return undefined;
  const n = normalize(keystoneNameOrKey);
  for (const [styleStr, list] of Object.entries(KEYSTONES_BY_STYLE)) {
    if ((list || []).some((w) => n.includes(w))) return Number(styleStr);
  }
  return undefined;
}

function orderKeystonesForStyle(
  styleId: number,
  runesDb: RunesDb,
  selectedId?: number | string
): Rune[] {
  const dictNorm = (KEYSTONES_BY_STYLE[styleId] ?? []).map(normalize);

  const all = Object.values(runesDb).filter((r) => {
    if ((r.styleId ?? -1) !== styleId) return false;
    const nName = normalize(r.name);
    const nKey = normalize(r.key ?? "");
    return dictNorm.includes(nName) || dictNorm.includes(nKey);
  });

  const selIdStr = selectedId != null ? String(selectedId) : "";
  const selected = all.find((r) => String(r.id) === selIdStr);

  const rank = (r: Rune) => {
    const nName = normalize(r.name);
    const nKey = normalize(r.key ?? "");
    const iName = dictNorm.indexOf(nName);
    const iKey = dictNorm.indexOf(nKey);
    const idx = Math.min(iName === -1 ? 999 : iName, iKey === -1 ? 999 : iKey);
    return idx;
  };

  const rest = all
    .filter((r) => String(r.id) !== selIdStr)
    .sort((a, b) => rank(a) - rank(b));
  return selected ? [selected, ...rest] : rest;
}

export function getKeystonesForPrimaryAndSecondary(
  runeIds: Array<number | string>,
  runesDb: RunesDb
): {
  primary: Rune[];
  secondary: Rune[];
  styleIds: { primary?: number; secondary?: number };
  selected?: { primary?: Rune; secondary?: Rune };
} {
  if (!runeIds?.length) {
    return { primary: [], secondary: [], styleIds: {} };
  }

  const primarySelected = runesDb[runeIds[0]];
  const primaryStyle =
    primarySelected?.styleId ??
    guessStyleIdByKeystoneName(primarySelected?.name || primarySelected?.key);

  let secondarySelected: Rune | undefined;
  let secondaryStyle: number | undefined;

  if (primaryStyle != null) {
    secondarySelected = runeIds
      .map((id) => runesDb[id])
      .find((r) => r && r.styleId != null && r.styleId !== primaryStyle);
    secondaryStyle =
      secondarySelected?.styleId ??
      guessStyleIdByKeystoneName(
        secondarySelected?.name || secondarySelected?.key
      );
  } else {
    secondarySelected = runesDb[runeIds[4]];
    secondaryStyle =
      secondarySelected?.styleId ??
      guessStyleIdByKeystoneName(
        secondarySelected?.name || secondarySelected?.key
      );
  }

  const primaryList =
    primaryStyle != null
      ? orderKeystonesForStyle(primaryStyle, runesDb, primarySelected?.id)
      : [];

  const secondaryList =
    secondaryStyle != null
      ? orderKeystonesForStyle(secondaryStyle, runesDb, secondarySelected?.id)
      : [];

  return {
    primary: primaryList,
    secondary: secondaryList,
    styleIds: { primary: primaryStyle, secondary: secondaryStyle },
    selected: { primary: primarySelected, secondary: secondarySelected },
  };
}
