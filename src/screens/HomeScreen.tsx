import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import TopBar from "../components/TopBar";
import MenuButton from "../components/MenuButton";
import SelectInputClass from "../components/SelectInputClass";
import ChampionCard from "../components/ChampionCard";
import { useNavigation } from "@react-navigation/native";
import { useChampions } from "../hooks/useChampions";

export default function HomeScreen() {
  const nav = useNavigation<any>();
  const [q, setQ] = React.useState("");
  const [role, setRole] = React.useState<
    "All" | "Top" | "Jungle" | "Mid" | "ADC" | "Support"
  >("All");
  const { loading, filterBy } = useChampions();
  const data = filterBy(q, role);

  return (
    <View style={styles.root}>
      <TopBar value={q} onChange={setQ} />
      <View style={styles.toolbar}>
        <MenuButton
          icon="filter-variant"
          label="Filtros"
          options={[
            { label: "Meta", value: "meta" },
            { label: "Favoritos", value: "fav" },
          ]}
          onSelect={() => {}}
        />
        <MenuButton
          icon="sort"
          label="Ordenar"
          options={[
            { label: "Win Rate", value: "wr" },
            { label: "Pick Rate", value: "pr" },
          ]}
          onSelect={() => {}}
        />
        <SelectInputClass value={role} onChange={(v) => setRole(v as any)} />
        <Button mode="contained-tonal" onPress={() => nav.navigate("Map")}>
          Mapa
        </Button>
        <Button mode="contained-tonal" onPress={() => nav.navigate("Share")}>
          Compartilhar
        </Button>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ChampionCard
              champion={item}
              onPress={() => nav.navigate("Champion", { id: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1F1F1F" },
  toolbar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8 as any,
  },
  list: { padding: 16, rowGap: 16 as any },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
});
