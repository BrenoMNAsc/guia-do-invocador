import { useEffect, useMemo, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Champion, Filter } from "../types/domain";
import { useDb } from "../context/dbContext";
import { useLoading } from "../context/LoadingContext";

type FilterExt = Filter & { favoritesOnly?: boolean };

const FAV_KEY = "@favorites:champions";

export function useChampions() {
  const [filter, setFilter] = useState<FilterExt | undefined>(undefined);
  const [data, setData] = useState<Champion[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { setIsLoading } = useLoading();
  const db = useDb();

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(FAV_KEY);
        setFavorites(raw ? JSON.parse(raw) : []);
      } catch {
        setFavorites([]);
      }
    })();
  }, []);

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback(async (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      AsyncStorage.setItem(FAV_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const setFavoritesOnly = useCallback((on: boolean) => {
    setFilter((prev) => ({ ...(prev ?? {}), favoritesOnly: on || undefined }));
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const champions = db.champions.filter((champion) => {
        if (filter?.name) {
          const nameMatch = champion.name
            .toLowerCase()
            .includes(filter.name.toLowerCase());
          if (!nameMatch) return false;
        }
        if (filter?.role) {
          if (!champion.roles.map((r) => r.toLowerCase()).includes(filter.role))
            return false;
        }
        if (filter?.championClass) {
          if (
            !champion.classes
              .map((c) => c.toLowerCase())
              .includes(filter.championClass)
          )
            return false;
        }
        if (filter?.favoritesOnly) {
          if (!favorites.includes(champion.id)) return false;
        }
        return true;
      });
      await new Promise((r) => setTimeout(r, 300));
      setData(champions);
    } catch {
    } finally {
      setIsLoading(false);
    }
  }, [db.champions, filter, favorites, setIsLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const favoritesOnly = useMemo(() => !!filter?.favoritesOnly, [filter]);

  return {
    data,
    filter,
    setFilter,
    refetch: fetchData,

    favorites,
    isFavorite,
    toggleFavorite,
    favoritesOnly,
    setFavoritesOnly,
  };
}
