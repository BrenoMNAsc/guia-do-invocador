import { View, StyleSheet } from "react-native";
import { TextInput, IconButton, Menu } from "react-native-paper";
import { useStyles } from "../hooks/useStyle";
import { useState } from "react";
import { ChampionClass } from "../types/domain";

export default function FilterBar({
  value,
  onChange,
  setClassFilter,
  favoritesOnly,
  onToggleFavorites,
}: {
  value: string;
  onChange: (t: string) => void;
  setClassFilter: (c: ChampionClass | undefined) => void;
  favoritesOnly: boolean;
  onToggleFavorites: () => void;
}) {
  const { theme } = useStyles();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

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
    menu: { margin: 0, borderRadius: 8 },
    contentMenu: {
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 8,
    },
  });

  const classes: Array<{ key: string; label: string; value: ChampionClass }> = [
    { key: "Assassin", label: "Assassino", value: "Assassin" },
    { key: "Fighter", label: "Lutador", value: "Fighter" },
    { key: "Mage", label: "Mago", value: "Mage" },
    { key: "Marksman", label: "Atirador", value: "Marksman" },
    { key: "Support", label: "Suporte", value: "Support" },
    { key: "Tank", label: "Tanque", value: "Tank" },
  ];

  return (
    <View style={[styles.root]}>
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
        icon={favoritesOnly ? "star" : "star-outline"}
        onPress={onToggleFavorites}
      />

      <Menu
        visible={visible}
        onDismiss={closeMenu}
        style={styles.menu}
        contentStyle={styles.contentMenu}
        anchor={
          <IconButton
            style={{ ...styles.buttons, marginLeft: 8 }}
            iconColor={theme.colors.primary}
            icon="filter-variant"
            onPress={openMenu}
          />
        }
      >
        <Menu.Item
          onPress={() => {
            setClassFilter(undefined);
            closeMenu();
          }}
          title="Todos"
        />
        {classes.map((c) => (
          <Menu.Item
            key={c.key}
            onPress={() => {
              setClassFilter(c.value);
              closeMenu();
            }}
            title={c.label}
          />
        ))}
      </Menu>
    </View>
  );
}
