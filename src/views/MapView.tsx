import { View, StyleSheet } from "react-native";
import RNMapView, { Marker, type Region } from "react-native-maps";
import { ActivityIndicator, Card, Text, IconButton } from "react-native-paper";
import { useLocation } from "../hooks/useLocation";
import { recommendServer, formatKm } from "../utils/servers";
import { useState } from "react";
import { openMaps, openSystemLocationSettings } from "../utils/intents";

const COLORS = {
  bg: "#FFFFFF",
  surface: "#FFFFFF",
  primary: "#FF8A5B",
  onSurface: "#1F1F1F",
  muted: "#6B7280",
};

export default function MapView() {
  const { coords, denied, loading } = useLocation();
  const [expanded, setExpanded] = useState(true);

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator color={COLORS.primary} />
      </View>
    );
  }

  if (denied) {
    return (
      <View style={[styles.root, styles.center, styles.pad]}>
        <Card style={styles.card}>
          <View style={styles.rowHeader}>
            <Text variant="titleMedium" style={{ color: COLORS.primary }}>
              Permissão de localização negada
            </Text>
            <IconButton
              icon="cog"
              onPress={openSystemLocationSettings}
              size={22}
              style={{ margin: 0 }}
              iconColor={COLORS.primary}
              accessibilityLabel="Abrir configurações de localização"
            />
          </View>
          <Text style={{ marginTop: 8, color: COLORS.muted }}>
            Habilite a localização nas configurações do sistema.
          </Text>
        </Card>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={{ color: COLORS.onSurface }}>
          Não foi possível obter sua localização.
        </Text>
      </View>
    );
  }

  const region: Region = {
    latitude: coords.latitude,
    longitude: coords.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const { server, distanceKm } = recommendServer(
    coords.latitude,
    coords.longitude
  );

  return (
    <View style={styles.root}>
      <RNMapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
        <Marker coordinate={coords} title="Você" />
      </RNMapView>

      <View style={styles.bottomOverlay}>
        <Card
          style={[
            styles.card,
            expanded ? styles.cardExpanded : styles.cardCollapsed,
          ]}
        >
          <View style={styles.rowHeader}>
            <Text variant="titleMedium" style={{ color: COLORS.primary }}>
              Servidor recomendado
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <IconButton
                icon="map-marker"
                onPress={() =>
                  openMaps(coords.latitude, coords.longitude, "Minha posição")
                }
                size={22}
                style={{ margin: 0, marginRight: 4 }}
                iconColor={COLORS.primary}
                accessibilityLabel="Abrir no Maps"
              />
              <IconButton
                icon={expanded ? "chevron-down" : "chevron-up"}
                onPress={() => setExpanded((e) => !e)}
                size={22}
                style={{ margin: 0 }}
                iconColor={COLORS.primary}
                accessibilityLabel={expanded ? "Minimizar" : "Maximizar"}
              />
            </View>
          </View>

          {expanded ? (
            <View>
              <Text
                variant="bodyMedium"
                style={{ marginTop: 4, color: COLORS.onSurface }}
              >
                {server.name} ({server.code})
              </Text>
              <Text
                variant="bodySmall"
                style={{ marginTop: 4, color: COLORS.muted }}
              >
                ~{formatKm(distanceKm)} do ponto mais próximo
              </Text>
            </View>
          ) : (
            <Text
              variant="bodyMedium"
              style={{ color: COLORS.onSurface }}
              numberOfLines={1}
            >
              {server.name} ({server.code})
            </Text>
          )}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 16 },

  bottomOverlay: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardExpanded: { minHeight: 86 },
  cardCollapsed: { paddingVertical: 10 },

  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
