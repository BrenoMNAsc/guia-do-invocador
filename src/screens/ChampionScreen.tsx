import React from "react";
import { Image, ScrollView, View, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import {
  Text,
  Chip,
  Divider,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import { useChampion } from "../hooks/useChampions";

export default function ChampionScreen() {
  const route = useRoute<RouteProp<any>>();
  const id = (route.params as any)?.id as string;
  const { loading, champion } = useChampion(id);

  if (loading || !champion) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }
  const build = champion.builds[0];

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
          {build.runes.map((r, i) => (
            <Card key={i} style={{ padding: 8, backgroundColor: "#2B2B2B" }}>
              <Image
                source={{ uri: r }}
                style={{ width: 48, height: 48, borderRadius: 12 }}
              />
            </Card>
          ))}
        </View>

        <Divider style={{ marginVertical: 12 }} />
        <Text variant="titleMedium">Itens</Text>
        <View style={[styles.rowWrap, { marginTop: 8 }]}>
          {build.items.map((it, i) => (
            <Card key={i} style={{ padding: 8, backgroundColor: "#2B2B2B" }}>
              <Image
                source={{ uri: it }}
                style={{ width: 48, height: 48, borderRadius: 12 }}
              />
            </Card>
          ))}
        </View>

        <Divider style={{ marginVertical: 12 }} />
        <Text variant="titleMedium">Ordem de Habilidades</Text>
        <View style={[styles.rowWrap, { marginTop: 8 }]}>
          {build.skills.split(">").map((s, i) => (
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
});
