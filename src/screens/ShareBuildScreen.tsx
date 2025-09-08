import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { List, ActivityIndicator, Button } from "react-native-paper";
import { useContacts } from "../hooks/useContacts";
import { shareBuild } from "../utils/intents";

export default function ShareBuildScreen() {
  const { loading, data, denied } = useContacts();
  const text = "Minha build favorita (mock): Aatrox — Q>W>E...";

  if (loading)
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  if (denied)
    return (
      <View style={[styles.root, styles.center, styles.pad]}>
        <Button mode="contained" onPress={() => shareBuild(text)}>
          Compartilhar por Intent
        </Button>
      </View>
    );

  return (
    <FlatList
      style={styles.root}
      data={data}
      keyExtractor={(it) => it.id!}
      renderItem={({ item }) => (
        <List.Item
          title={item.name}
          description={item.emails?.[0]?.email ?? "sem e-mail"}
          onPress={() => shareBuild(`${text} — para: ${item.name}`)}
        />
      )}
      ListFooterComponent={
        <View style={{ padding: 16 }}>
          <Button mode="contained" onPress={() => shareBuild(text)}>
            Compartilhar sem contato
          </Button>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1F1F1F" },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 16 },
});
