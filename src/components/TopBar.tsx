import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton, useTheme } from "react-native-paper";

export default function TopBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.root, { backgroundColor: theme.colors.primary }]}>
      <TextInput
        value={value}
        onChangeText={onChange}
        mode="outlined"
        placeholder="Guia do Invocador"
        style={styles.input}
      />
      <IconButton icon="magnify" onPress={() => {}} />
      <IconButton icon="cog" onPress={() => {}} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: { flex: 1 },
});
