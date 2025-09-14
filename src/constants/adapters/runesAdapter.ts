import type { Rune } from "../../types/domain";

function toCdn(url?: string) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://ddragon.leagueoflegends.com/cdn/img/${url}`;
}

export function buildRunesDbFromGenericMap(raw: any): Record<number, Rune> {
  const out: Record<number, Rune> = {};
  if (!raw) return out;

  if (Array.isArray(raw)) {
    for (const style of raw) {
      const styleId: number | undefined = style?.id;
      const styleKey: string | undefined = style?.key;
      const styleName: string | undefined = style?.name;
      const styleIcon: string | undefined = toCdn(style?.icon);

      const slots = Array.isArray(style?.slots) ? style.slots : [];
      slots.forEach((slot: any, slotIdx: number) => {
        const runes = Array.isArray(slot?.runes) ? slot.runes : [];
        runes.forEach((r: any) => {
          if (typeof r?.id === "number") {
            out[r.id] = {
              id: r.id,
              name: r.name,
              key: r.key,
              shortDescription: r.shortDesc ?? r.shortDescription,
              longDesc: r.longDesc,
              icon: toCdn(r.icon),
              styleId,
              styleKey,
              styleName,
              styleIcon,
              slot: slotIdx,
            } as Rune;
          }
        });
      });
    }
    return out;
  }

  for (const node of Object.values<any>(raw)) {
    if (typeof node?.id === "number" && node?.name) {
      const styleIconAbs = toCdn(node?.styleIcon);
      out[node.id] = {
        id: node.id,
        name: node.name,
        key: node.key,
        shortDescription: node?.shortDesc ?? node?.shortDescription,
        longDesc: node?.longDesc,
        icon: toCdn(node?.icon),
        styleId: node?.styleId,
        styleKey: node?.styleKey,
        styleName: node?.styleName,
        styleIcon: styleIconAbs,
        slot: typeof node?.slot === "number" ? node.slot : undefined,
      } as Rune;
    }
  }
  return out;
}
