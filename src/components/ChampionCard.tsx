import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { Card, Text, IconButton, ProgressBar } from "react-native-paper";
import type { Champion } from "../types/domain";

export default function ChampionCard({
  champion,
  onPress,
}: {
  champion: Champion;
  onPress: () => void;
}) {
  const build = champion.builds[0];
  return (
    <Card onPress={onPress} style={styles.card}>
      <Card.Cover source={{ uri: champion.portrait }} />
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text variant="titleMedium">{champion.name}</Text>
          <IconButton icon="star-outline" onPress={() => {}} />
        </View>
        <Text variant="bodySmall" style={styles.muted}>
          {champion.role}
        </Text>
        <View style={{ marginTop: 8 }}>
          <Text variant="labelSmall">
            Win Rate {build.winRate}% • Pick {build.pickRate}%
          </Text>
          <ProgressBar
            progress={build.winRate / 100}
            style={{ marginTop: 6 }}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#2B2B2B", borderRadius: 16, overflow: "hidden" },
  content: { paddingTop: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  muted: { color: "#BDBDBD" },
});
