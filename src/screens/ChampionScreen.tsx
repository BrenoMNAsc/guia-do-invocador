import { Image, ScrollView, View, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Text,
  Chip,
  Divider,
  Card,
  ActivityIndicator,
} from "react-native-paper";

import { Champion } from "../types/domain";

interface ChampionScreenProps {
  champion: Champion;
}
export default function ChampionScreen({ champion }: ChampionScreenProps) {
  const route = useRoute<RouteProp<any>>();
  const id = (route.params as any)?.id as string;

  const build = champion.builds[0];

  const runeIcons = (build.runes || [])
    .map((rid) => build.runes[rid]?.icon)
    .filter(Boolean) as string[];
  const itemSections: { label: string; ids: (number | string)[] }[] = [
    { label: "Start", ids: build.items.start || [] },
    { label: "Core", ids: build.items.core || [] },
    { label: "Boots", ids: build.items.boots || [] },
    { label: "Opcional", ids: build.items.optional || [] },
  ];

  return (
    <ScrollView style={styles.root}>
      <Image
        source={{ uri: champion.portrait }}
        style={{ width: "100%", height: 220 }}
      />
      <View style={styles.pad}>
        <Text variant="headlineSmall">{champion.name}</Text>
        <Text variant="bodyMedium" style={{ color: "#ccc" }}>
          {build.title}
        </Text>

        <Divider style={{ marginVertical: 12 }} />
        <Text variant="titleMedium">Runas</Text>
        <View style={[styles.rowWrap, { marginTop: 8 }]}>
          {runeIcons.map((uri, i) => (
            <Card key={i} style={styles.cardDark}>
              <Image source={{ uri }} style={styles.square48} />
            </Card>
          ))}
        </View>

        {itemSections.map((sec) => {
          const icons = sec.ids
            .map((iid) => itemsDb[iid]?.icon)
            .filter(Boolean) as string[];
          if (!icons.length) return null;
          return (
            <View key={sec.label} style={{ marginTop: 12 }}>
              <Divider style={{ marginVertical: 12 }} />
              <Text variant="titleMedium">{sec.label}</Text>
              <View style={[styles.rowWrap, { marginTop: 8 }]}>
                {icons.map((uri, i) => (
                  <Card key={`${sec.label}-${i}`} style={styles.cardDark}>
                    <Image source={{ uri }} style={styles.square48} />
                  </Card>
                ))}
              </View>
            </View>
          );
        })}

        <Divider style={{ marginVertical: 12 }} />
        <Text variant="titleMedium">Ordem de Habilidades</Text>
        <View style={[styles.rowWrap, { marginTop: 8 }]}>
          {(build.skillOrder || "").split(">").map((s, i) => (
            <Chip key={i} mode="outlined">
              {s}
            </Chip>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1F1F1F" },
  pad: { padding: 16 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 as any },
  center: { alignItems: "center", justifyContent: "center" },
  cardDark: { padding: 8, backgroundColor: "#2B2B2B" },
  square48: { width: 48, height: 48, borderRadius: 12 },
});
