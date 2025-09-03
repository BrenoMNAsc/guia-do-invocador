import * as React from "react";
import * as Location from "expo-location";

export function useLocation() {
  const [coords, setCoords] = React.useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [denied, setDenied] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setDenied(true);
        setLoading(false);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  return { coords, denied, loading };
}
