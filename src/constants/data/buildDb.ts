import { Champion, Item, Rune } from "../../types/domain";

import { buildChampionsFromDdragonJson } from "../adapters/championsAdapter";
import { buildItemsDbFromGenericMap } from "../adapters/itemsAdapter";
import { buildRunesDbFromGenericMap } from "../adapters/runesAdapter";

import championsJson from "../raws/champion.json";
import runesRaw from "../raws/runesReforged.json";
import itemsRaw from "../raws/item.json";

export type DbShape = {
  champions: Champion[];
  items: Record<string | number, Item>;
  runes: Record<string | number, Rune>;
};

let _db: DbShape | null = null;

function safe<T>(fn: () => T, fallback: T): T {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

export function buildDb(): DbShape {
  if (_db) return _db;

  const champions = safe(
    () => buildChampionsFromDdragonJson(championsJson as any),
    []
  );
  const items = safe(() => buildItemsDbFromGenericMap(itemsRaw as any), {});
  const runes = safe(() => buildRunesDbFromGenericMap(runesRaw as any), {});

  _db = { champions, items, runes };
  return _db;
}
