export type ServerRegion = {
  key: string;
  code: string;
  name: string;
  lat: number;
  lng: number;
};

export const SERVER_REGIONS: ServerRegion[] = [
  { key: "BR", code: "BR", name: "Brasil", lat: -23.5505, lng: -46.6333 },
  { key: "LAN", code: "LAN", name: "LatAm Norte", lat: 19.4326, lng: -99.1332 },
  { key: "LAS", code: "LAS", name: "LatAm Sul", lat: -33.4489, lng: -70.6693 },
  {
    key: "NA",
    code: "NA",
    name: "América do Norte",
    lat: 41.8781,
    lng: -87.6298,
  },
  { key: "EUW", code: "EUW", name: "Europa Oeste", lat: 50.1109, lng: 8.6821 },
  { key: "EUNE", code: "EUNE", name: "Europa N/E", lat: 52.2297, lng: 21.0122 },
  { key: "TR", code: "TR", name: "Turquia", lat: 41.0082, lng: 28.9784 },
  { key: "KR", code: "KR", name: "Coreia", lat: 37.5665, lng: 126.978 },
  { key: "JP", code: "JP", name: "Japão", lat: 35.6762, lng: 139.6503 },
  { key: "OCE", code: "OCE", name: "Oceania", lat: -33.8688, lng: 151.2093 },
  {
    key: "SEA",
    code: "SEA",
    name: "Sudeste Asiático",
    lat: 1.3521,
    lng: 103.8198,
  },
  { key: "RU", code: "RU", name: "Rússia/CEI", lat: 55.7558, lng: 37.6173 },
];

const toRad = (d: number) => (d * Math.PI) / 180;
const R = 6371;

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s1 = Math.sin(dLat / 2) ** 2;
  const s2 =
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s1 + s2));
}

export function recommendServer(lat: number, lng: number) {
  const me = { lat, lng };
  let best = SERVER_REGIONS[0];
  let bestDist = Infinity;

  for (const srv of SERVER_REGIONS) {
    const d = haversineKm(me, { lat: srv.lat, lng: srv.lng });
    if (d < bestDist) {
      bestDist = d;
      best = srv;
    }
  }
  return { server: best, distanceKm: bestDist };
}

export const formatKm = (km: number) =>
  km < 1000 ? `${km.toFixed(0)} km` : `${(km / 1000).toFixed(1)} mil km`;
