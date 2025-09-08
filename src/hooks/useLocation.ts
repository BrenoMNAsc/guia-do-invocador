import * as React from "react";
import * as Location from "expo-location";

export function useLocation() {
  const [coords, setCoords] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [denied, setDenied] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          if (active) {
            setDenied(true);
            setLoading(false);
          }
          return;
        }
        const pos = await Location.getCurrentPositionAsync({});
        if (active) {
          setCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      } catch (e: any) {
        if (active) setError(e?.message ?? "Erro ao obter localização");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { coords, denied, loading, error };
}
