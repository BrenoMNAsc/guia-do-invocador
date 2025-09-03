import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { ActivityIndicator, Card, Text } from "react-native-paper";
import { useLocation } from "../hooks/useLocation";
import { recommendServer, formatKm } from "../utils/servers";

export default function MapScreen() {
  const { coords, denied, loading } = useLocation();

  if (loading)
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  if (denied)
    return (
      <View style={[styles.root, styles.center, styles.pad]}>
        <Card style={styles.card}>
          <Text variant="titleMedium">Permissão de localização negada</Text>
          <Text style={{ marginTop: 8, color: "#ccc" }}>
            Habilite a localização nas configurações do sistema.
          </Text>
        </Card>
      </View>
    );
  if (!coords)
    return (
      <View style={[styles.root, styles.center]}>
        <Text>Sem localização.</Text>
      </View>
    );

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
      <MapView style={{ flex: 1 }} initialRegion={region} showsUserLocation>
        <Marker coordinate={coords} title="Você" />
      </MapView>
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Text variant="titleMedium">Servidor recomendado</Text>
          <Text variant="bodyMedium" style={{ marginTop: 4 }}>
            {server.name} ({server.code})
          </Text>
          <Text variant="bodySmall" style={{ marginTop: 4, color: "#ccc" }}>
            ~{formatKm(distanceKm)} do ponto mais próximo
          </Text>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#1F1F1F" },
  center: { alignItems: "center", justifyContent: "center" },
  pad: { padding: 16 },
  overlay: { position: "absolute", left: 16, right: 16, top: 16 },
  card: { backgroundColor: "#2B2B2B", padding: 16, borderRadius: 16 },
});
