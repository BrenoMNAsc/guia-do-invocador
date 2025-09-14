import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useLocation() {
  const [coords, setCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [denied, setDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
