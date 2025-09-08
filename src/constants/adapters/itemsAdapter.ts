import type { Item } from "../../types/domain";

export function buildItemsDbFromGenericMap(
  raw: any
): Record<string | number, Item> {
  const out: Record<string | number, Item> = {};

  if (Array.isArray(raw)) {
    for (const it of raw) {
      if (it?.id != null && it?.name) {
        out[it.id] = {
          id: it.id,
          name: it.name,
          shortDescription: it.shortDescription ?? "",
          icon: it.icon,
        };
      }
    }
    return out;
  }

  // Caso 2: DDragon-like { data: { [id]: { name, description, image } } }
  if (raw?.data && typeof raw.data === "object") {
    for (const [id, node] of Object.entries<any>(raw.data)) {
      out[id] = {
        id,
        name: node?.name ?? String(id),
        shortDescription: node?.plaintext || node?.shortDescription || "",
        icon: node?.image?.full
          ? `https://ddragon.leagueoflegends.com/cdn/15.17.1/img/item/${node.image.full}`
          : undefined,
      };
    }
    return out;
  }

  // Fallback: tente mapear chaves óbvias
  for (const [id, node] of Object.entries<any>(raw)) {
    if (node?.name) {
      const key: number | string = (node?.id ?? id) as any;
      out[key] = {
        id: key,
        name: node.name,
        shortDescription: node?.shortDescription ?? node?.plaintext ?? "",
        icon: node?.icon,
      };
    }
  }
  return out;
}
