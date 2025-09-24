import {
  View,
  ScrollView,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
import {
  Text,
  Divider,
  Card,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import type { BuildSpec, Rune } from "../types/domain";
import { useChampionDetails } from "../hooks/useChampionDetails";
import { useRunes } from "../hooks/useRunes";
import { useItems } from "../hooks/useItems";
import { getChampionImage } from "../assets/champion";
import { getKeystonesForPrimaryAndSecondary, STYLE_IDS } from "../utils/runes";
import { ReactNode, useCallback, useMemo } from "react";
import { shareBuild, openChampionWiki } from "../utils/intents";

export type ChampionViewProps = { id: string };

const normalize = (s = "") =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const KEYSTONE_ORDER: Record<number, readonly string[]> = {
  [STYLE_IDS.SORCERY]: [
    "summon aery",
    "invocar aery",
    "arcane comet",
    "cometa arcano",
    "phase rush",
    "ímpeto gradual",
    "impeto gradual",
  ],
  [STYLE_IDS.PRECISION]: [
    "press the attack",
    "pressione o ataque",
    "lethal tempo",
    "ritmo fatal",
    "fleet footwork",
    "pé veloz",
    "pe veloz",
    "conqueror",
    "conquistador",
  ],
  [STYLE_IDS.DOMINATION]: [
    "electrocute",
    "eletrocutar",
    "dark harvest",
    "colheita sombria",
    "hail of blades",
    "chuva de lâminas",
    "chuva de laminas",
  ],
  [STYLE_IDS.RESOLVE]: [
    "grasp of the undying",
    "agarrar do perpétuo",
    "agarrar do perpetuo",
    "aftershock",
    "pós-choque",
    "pos-choque",
    "pos choque",
    "guardian",
    "guardião",
    "guardiao",
  ],
  [STYLE_IDS.INSPIRATION]: [
    "glacial augment",
    "aprimoramento glacial",
    "unsealed spellbook",
    "livro de feitiços",
    "livro de feiticos",
    "first strike",
    "primeiro ataque",
  ],
};

function sortKeystonesByClientOrder(styleId: number, list: Rune[]) {
  const order = (KEYSTONE_ORDER[styleId] ?? []).map(normalize);
  const rank = (r: Rune) => {
    const nName = normalize(r.name);
    const nKey = normalize(r.key ?? "");
    const i1 = order.indexOf(nName);
    const i2 = order.indexOf(nKey);
    return Math.min(i1 === -1 ? 999 : i1, i2 === -1 ? 999 : i2);
  };
  return [...list].sort((a, b) => rank(a) - rank(b));
}

function groupMinorBySlot(
  runesDb: Record<string | number, Rune>,
  styleId: number
): Record<1 | 2 | 3, Rune[]> {
  const out: Record<1 | 2 | 3, Rune[]> = { 1: [], 2: [], 3: [] };
  for (const r of Object.values(runesDb)) {
    if (r.styleId !== styleId) continue;
    const slot = (r as any).slot;
    if (slot === 1 || slot === 2 || slot === 3) out[slot as 1 | 2 | 3].push(r);
  }
  (Object.keys(out) as Array<"1" | "2" | "3">).forEach((k) =>
    out[k as unknown as 1 | 2 | 3].sort((a, b) =>
      normalize(a.name).localeCompare(normalize(b.name))
    )
  );
  return out;
}

function RuneIconCell({
  uri,
  selected,
  size = 36,
}: {
  uri?: string;
  selected: boolean;
  size?: number;
}) {
  return (
    <Card
      style={[
        styles.runeDotCard,
        { width: size + 8, height: size + 8, borderRadius: size },
      ]}
    >
      <Image
        source={{ uri: uri ?? placeholderRune }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          !selected && styles.desaturated,
        ]}
      />
    </Card>
  );
}

function ItemIconCell({ uri }: { uri?: string }) {
  return (
    <Card style={styles.itemCard}>
      <Image source={{ uri: uri ?? placeholderItem }} style={styles.itemIcon} />
    </Card>
  );
}

function SkillOrderPill({ order }: { order: string }) {
  const items = (order || "")
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean);
  return (
    <View style={styles.skillPill}>
      {items.map((s, i) => (
        <View key={`${s}-${i}`} style={styles.skillCell}>
          <Text style={styles.skillCellText}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ paddingHorizontal: 12, paddingTop: 12 }}>
      <Text variant="titleMedium" style={styles.sectionTitle}>
        {title}
      </Text>
      <Divider style={styles.sectionDivider} />
      <View style={{ paddingTop: 6 }}>{children}</View>
    </View>
  );
}

function buildShareText({
  championName,
  build,
  runes,
  items,
}: {
  championName: string;
  build: BuildSpec;
  runes: Record<string | number, Rune>;
  items: Record<string | number, { name?: string }>;
}) {
  const r = (id: string | number) => runes[id]?.name || "";
  const list = (arr?: Array<string | number>) =>
    (arr || [])
      .map((id) => items[id]?.name || `#${id}`)
      .filter(Boolean)
      .join(", ");
  const prim = [
    r(build.runes[0]),
    r(build.runes[1]),
    r(build.runes[2]),
    r(build.runes[3]),
  ]
    .filter(Boolean)
    .join(" | ");
  const sec = [r(build.runes[4]), r(build.runes[5])]
    .filter(Boolean)
    .join(" | ");
  return [
    `Build — ${championName} (${build.role})`,
    `Runas (Primária): ${prim}`,
    `Runas (Secundária): ${sec}`,
    `Itens Iniciais: ${list(build.items.start)}`,
    `Botas: ${list(build.items.boots)}`,
    `Core: ${list(build.items.core)}`,
    `Situacionais: ${list(build.items.optional)}`,
    `Habilidades: ${build.skillOrder}`,
    `Win ${build.winRate}% • Pick ${build.pickRate}%`,
  ].join("\n");
}

export default function ChampionView({ id }: ChampionViewProps) {
  const { data: champion, isLoading } = useChampionDetails({ id });
  const { runes } = useRunes();
  const { items } = useItems();

  const build: BuildSpec | null = useMemo(() => {
    if (!champion?.builds?.length) return null;
    return champion.builds.find((b) => b.isBest) ?? champion.builds[0];
  }, [champion]);

  const headerImg = useMemo(
    () => (champion ? getChampionImage(champion.id) : undefined),
    [champion]
  );

  const runeIds = build?.runes ?? [];
  const primaryPickedIds = useMemo(
    () => new Set(runeIds.slice(0, 4).map(String)),
    [runeIds]
  );
  const secondaryPickedIds = useMemo(
    () => new Set(runeIds.slice(4, 6).map(String)),
    [runeIds]
  );

  const { primary, styleIds, selected } = useMemo(
    () => getKeystonesForPrimaryAndSecondary(runeIds, runes),
    [runeIds, runes]
  );

  const primaryStyleId = styleIds.primary!;
  const secondaryStyleId = styleIds.secondary;

  const primaryKeystonesOrdered = useMemo(
    () => sortKeystonesByClientOrder(primaryStyleId, primary),
    [primaryStyleId, primary]
  );

  const primarySlots = useMemo(
    () => groupMinorBySlot(runes, primaryStyleId),
    [runes, primaryStyleId]
  );

  const secondarySlotRows = useMemo(() => {
    if (!secondaryStyleId) return [];
    const slots = groupMinorBySlot(runes, secondaryStyleId);
    const chosenSlots = new Set<number>();
    for (const id of runeIds.slice(4, 6)) {
      const r = runes[id];
      if (r?.styleId === secondaryStyleId && (r as any).slot) {
        chosenSlots.add((r as any).slot as number);
      }
    }
    return ([1, 2, 3] as const)
      .filter((s) => chosenSlots.has(s))
      .map((s) => ({ slot: s, runes: slots[s] }));
  }, [runes, runeIds, secondaryStyleId]);

  const groupItems = useMemo(
    () => ({
      Iniciais: build?.items?.start ?? [],
      Botas: build?.items?.boots ?? [],
      "Itens principais": build?.items?.core ?? [],
      Situacionais: build?.items?.optional ?? [],
    }),
    [build?.items]
  );

  const itemIcon = useCallback(
    (iid: number | string) =>
      (items[iid]?.icon as string | undefined) ?? placeholderItem,
    [items]
  );

  const onShare = useCallback(() => {
    if (!champion || !build) return;
    const msg = buildShareText({
      championName: champion.name,
      build,
      runes,
      items,
    });
    shareBuild(msg);
  }, [champion, build, runes, items]);

  if (isLoading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!champion || !build || !primaryStyleId) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={{ marginBottom: 12 }}>Campeão não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <ImageBackground
        source={headerImg}
        style={styles.header}
        imageStyle={styles.headerImg}
      >
        <View style={styles.headerOverlay}>
          <Text style={styles.headerName}>{champion.name}</Text>
        </View>

        <IconButton
          icon="share-variant"
          size={22}
          onPress={onShare}
          mode="contained"
          containerColor="rgba(0,0,0,0.45)"
          iconColor="#fff"
          style={styles.shareBtn}
          accessibilityLabel="Compartilhar build"
        />

        <IconButton
          icon="book-open-variant"
          size={22}
          onPress={() => openChampionWiki(champion.name)}
          mode="contained"
          containerColor="rgba(0,0,0,0.45)"
          iconColor="#fff"
          style={[styles.shareBtn, { right: 52 }]}
          accessibilityLabel="Abrir wiki do campeão"
        />
      </ImageBackground>

      <Section title="Runas">
        <View style={styles.row}>
          {primaryKeystonesOrdered.map((r) => {
            const isSelected = String(r.id) === String(selected?.primary?.id);
            return (
              <RuneIconCell
                key={String(r.id)}
                uri={r.icon}
                selected={isSelected}
                size={44}
              />
            );
          })}
        </View>

        {([1, 2, 3] as const).map((slot) => (
          <View key={`p-slot-${slot}`} style={styles.row}>
            {primarySlots[slot].map((r) => (
              <RuneIconCell
                key={`p-${slot}-${String(r.id)}`}
                uri={r.icon}
                selected={primaryPickedIds.has(String(r.id))}
              />
            ))}
          </View>
        ))}

        {secondaryStyleId && (
          <>
            <Divider style={{ marginVertical: 10 }} />
            {secondarySlotRows.map(({ slot, runes: row }) => (
              <View key={`s-slot-${slot}`} style={styles.row}>
                {row.map((r) => (
                  <RuneIconCell
                    key={`s-${slot}-${String(r.id)}`}
                    uri={r.icon}
                    selected={secondaryPickedIds.has(String(r.id))}
                  />
                ))}
              </View>
            ))}
          </>
        )}
      </Section>

      <Section title="Itens">
        <View style={{ gap: 10 as any }}>
          {Object.entries(groupItems).map(([label, ids]) => {
            if (!ids?.length) return null;
            return (
              <View key={label} style={{ marginTop: 4 }}>
                <Text variant="labelSmall" style={styles.subLabel}>
                  {label}
                </Text>
                <View style={styles.itemsRow}>
                  {ids.map((iid, idx) => (
                    <ItemIconCell key={`${label}-${idx}`} uri={itemIcon(iid)} />
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      </Section>

      <Section title="Ordem de Habilidades">
        <Text variant="labelSmall" style={styles.subLabel}>
          Prioridade →
        </Text>
        <View style={styles.skillRow}>
          <SkillOrderPill order={build.skillOrder} />
        </View>
      </Section>
    </ScrollView>
  );
}

const placeholderRune = "https://via.placeholder.com/40x40.png?text=R";
const placeholderItem = "https://via.placeholder.com/40x40.png?text=I";

const COLORS = { bg: "#FFFFFF", section: "#FF8A65" };

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { alignItems: "center", justifyContent: "center" },
  header: { width: "100%", height: 190, backgroundColor: "#111" },
  headerImg: { resizeMode: "cover" },
  headerOverlay: { flex: 1, justifyContent: "flex-end", padding: 10 },
  headerName: {
    color: COLORS.section,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "right",
  },
  sectionTitle: { color: COLORS.section, fontWeight: "700" },
  sectionDivider: {
    height: 2,
    backgroundColor: COLORS.section,
    opacity: 0.7,
    marginTop: 6,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10 as any,
    justifyContent: "flex-start",
    paddingVertical: 4,
  },
  runeDotCard: {
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
  },
  desaturated: { opacity: 0.45 },
  subLabel: { color: "#E57373", height: 25 },
  itemsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10 as any,
    flexWrap: "wrap",
  },
  itemCard: {
    padding: 6,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 0,
  },
  itemIcon: { width: 36, height: 36, borderRadius: 6 },
  skillRow: { flexDirection: "row", alignItems: "center", gap: 8 as any },
  skillPill: {
    flexDirection: "row",
    backgroundColor: "#32C7C7",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexWrap: "wrap",
    gap: 6 as any,
  },
  skillCell: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  skillCellText: { color: "#1B3F3F", fontWeight: "700" },
  shareBtn: { position: "absolute", top: 8, right: 8, borderRadius: 16 },
});
