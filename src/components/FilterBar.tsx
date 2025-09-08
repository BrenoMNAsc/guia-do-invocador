import React from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton, useTheme } from "react-native-paper";
import { useStyles } from "../hooks/useStyle";

export default function FilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (t: string) => void;
}) {
  const { theme, padding, margin, gap, scrollView, button } = useStyles();

  const styles = StyleSheet.create({
    root: {
      flexDirection: "row",
      alignItems: "center",
      padding: 0,
      height: 38,
      marginBottom: 10,
    },
    input: {
      flex: 1,
      backgroundColor: theme.colors.primaryContainer,
      height: 38,
      borderRadius: 8,
    },
    underlineStyle: { display: "none" },
    buttons: {
      margin: 0,
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 8,
      width: 38,
      height: 38,
    },
  });

  return (
    <View style={[styles.root]}>
      <IconButton
        style={{ ...styles.buttons, marginRight: 8 }}
        iconColor={theme.colors.primary}
        icon="reorder-horizontal"
        onPress={() => {}}
      />
      <TextInput
        value={value}
        onChangeText={onChange}
        mode="flat"
        style={styles.input}
        underlineStyle={styles.underlineStyle}
        right={
          <TextInput.Icon
            icon="magnify"
            color={theme.colors.primary}
            onPress={() => {}}
          />
        }
      />
      <IconButton
        style={{ ...styles.buttons, marginLeft: 8 }}
        iconColor={theme.colors.primary}
        icon="filter-variant"
        onPress={() => {}}
      />
    </View>
  );
}
