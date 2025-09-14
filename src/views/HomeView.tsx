import React, { useEffect, useState } from "react";
import { View, ScrollView, Pressable, FlatList } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FilterBar from "../components/FilterBar";
import { useNavigation } from "@react-navigation/native";
import type { ChampionClass, Role } from "../types/domain";
import { useChampions } from "../hooks/useChampions";
import { useStyles } from "../hooks/useStyle";
import { RoleIcon, type RoleUpper } from "../icons/RoleIcon";
import ChampionCard from "../components/ChampionCard";

export default function HomeView() {
  const nav = useNavigation<any>();
  const { theme, padding, gap, scrollView, button, margin } = useStyles();

  const {
    data,
    filter,
    setFilter,
    favoritesOnly,
    setFavoritesOnly,
    isFavorite,
    toggleFavorite,
  } = useChampions();

  const [search, setSearch] = useState(filter?.name ?? "");
  useEffect(() => {
    setFilter((prev) => ({ ...(prev ?? {}), name: search || undefined }));
  }, [search, setFilter]);

  const [roleLabel, setRoleLabel] = useState<RoleUpper>(
    (filter?.role?.toUpperCase() as RoleUpper) ?? "ALL"
  );

  const handleSelectRole = (role: RoleUpper) => {
    setRoleLabel(role);
    setFilter((prev) => ({
      ...(prev ?? {}),
      role: role === "ALL" ? undefined : (role.toLowerCase() as Role),
    }));
  };

  const handleSelectClass = (championClass: ChampionClass | undefined) => {
    setFilter((prev) => ({
      ...(prev ?? {}),
      championClass:
        championClass === undefined
          ? undefined
          : (championClass.toLowerCase() as ChampionClass),
    }));
  };

  const roles: Array<{ key: string; value: RoleUpper }> = [
    { key: "ALL", value: "ALL" },
    { key: "TOP", value: "TOP" },
    { key: "JUNGLE", value: "JUNGLE" },
    { key: "MID", value: "MID" },
    { key: "ADC", value: "ADC" },
    { key: "SUPPORT", value: "SUPPORT" },
  ];

  const handleChampionPress = (championId: string) => {
    nav.navigate("Champion", { championId });
  };

  return (
    <View
      style={[
        padding.horizontal.sm,
        { backgroundColor: theme.colors.background, flex: 1 },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[scrollView.horizontal, { marginBottom: 10 }]}
        contentContainerStyle={[
          gap.sm,
          { alignItems: "flex-start", justifyContent: "flex-start" },
        ]}
      >
        {roles.map((r) => {
          const isSelected = roleLabel === r.value;
          return (
            <Pressable key={r.key} onPress={() => handleSelectRole(r.value)}>
              <IconButton
                mode={!isSelected ? "contained" : "outlined"}
                style={[
                  margin.horizontal.xs,
                  !isSelected ? button.contained : button.outlined,
                  {
                    backgroundColor: theme.colors.primaryContainer,
                    borderColor: theme.colors.primary,
                    borderWidth: isSelected ? 2 : 0,
                    borderRadius: 8,
                    height: 37,
                    width: 57,
                    margin: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                icon={() => <RoleIcon role={r.value} width={57} height={20} />}
                theme={{ colors: { primary: theme.colors.primary } }}
                accessibilityLabel={r.key}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <FilterBar
        value={search}
        onChange={setSearch}
        setClassFilter={handleSelectClass}
        favoritesOnly={favoritesOnly}
        onToggleFavorites={() => setFavoritesOnly(!favoritesOnly)}
      />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <ChampionCard
            champion={item}
            onPress={() => handleChampionPress(item.id)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text variant="bodyMedium" style={{ color: "#888" }}>
              Nenhum campeão encontrado
            </Text>
          </View>
        }
      />
    </View>
  );
}
