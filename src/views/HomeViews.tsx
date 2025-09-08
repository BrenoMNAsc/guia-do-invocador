import React from "react";
import { View, ScrollView, Pressable, FlatList } from "react-native";
import { IconButton, Text } from "react-native-paper";
import FilterBar from "../components/FilterBar";
import { useNavigation } from "@react-navigation/native";
import type { Role } from "../types/domain";
import { useChampions } from "../hooks/useChampions";
import { useStyles } from "../hooks/useStyle";
import { RoleIcon, type RoleUpper } from "../icons/RoleIcon";
import ChampionCard from "../components/ChampionCard";

export default function HomeView() {
  const nav = useNavigation<any>();
  const { theme, padding, margin, gap, scrollView, button } = useStyles();

  const { loading, data, filter, setFilter } = useChampions();

  // busca
  const [search, setSearch] = React.useState(filter?.name ?? "");
  React.useEffect(() => {
    setFilter((prev) => ({ ...(prev ?? {}), name: search || undefined }));
  }, [search, setFilter]);

  // role selecionada - agora usando RoleUpper
  const [roleLabel, setRoleLabel] = React.useState<RoleUpper>(
    (filter?.role?.toUpperCase() as RoleUpper) ?? "ALL"
  );
  const handleSelectRole = (role: RoleUpper) => {
    setRoleLabel(role);
    setFilter((prev) => ({
      ...(prev ?? {}),
      role: role === "ALL" ? undefined : (role.toLowerCase() as Role),
    }));
  };

  // use valores em maiúsculo (RoleUpper)
  const roles: Array<{ key: string; label: string; value: RoleUpper }> = [
    { key: "ALL", label: "Todos", value: "ALL" },
    { key: "TOP", label: "Topo", value: "TOP" },
    { key: "JUNGLE", label: "Selva", value: "JUNGLE" },
    { key: "MID", label: "Meio", value: "MID" },
    { key: "ADC", label: "Atirador", value: "ADC" },
    { key: "SUPPORT", label: "Suporte", value: "SUPPORT" },
  ];

  const handleChampionPress = (championId: string) => {
    nav.navigate("ChampionDetails", { id: championId });
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
                icon={(p) => <RoleIcon role={r.value} width={57} height={20} />}
                theme={{ colors: { primary: theme.colors.primary } }}
                accessibilityLabel={r.label}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <FilterBar value={search} onChange={setSearch} />

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={1}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => (
          <ChampionCard
            champion={item}
            onPress={() => handleChampionPress(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text variant="bodyMedium" style={{ color: "#888" }}>
              {loading ? "Carregando..." : "Nenhum campeão encontrado"}
            </Text>
          </View>
        }
      />
    </View>
  );
}
