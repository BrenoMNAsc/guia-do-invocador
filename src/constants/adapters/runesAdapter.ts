import type { Rune } from "../../types/domain";

export function buildRunesDbFromGenericMap(raw: any): Record<number, Rune> {
  const out: Record<number, Rune> = {};
  if (!raw) return out;

  if (Array.isArray(raw)) {
    for (const style of raw) {
      const styleId = style?.id;
      if (Array.isArray(style?.slots)) {
        for (const slot of style.slots) {
          for (const r of slot?.runes ?? []) {
            if (typeof r?.id === "number") {
              out[r.id] = {
                id: r.id,
                name: r.name,
                key: r.key,
                shortDescription: r.shortDesc ?? r.shortDescription,
                icon: r.icon
                  ? `https://ddragon.leagueoflegends.com/cdn/img/${r.icon}`
                  : undefined,
                styleId,
              };
            }
          }
        }
      }
    }
    return out;
  }

  for (const node of Object.values<any>(raw)) {
    if (typeof node?.id === "number" && node?.name) {
      out[node.id] = {
        id: node.id,
        name: node.name,
        key: node.key,
        shortDescription: node?.shortDescription,
        icon: node?.icon,
        styleId: node?.styleId,
      };
    }
  }
  return out;
}
