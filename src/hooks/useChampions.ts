import { useEffect, useState } from "react";
import { Champion, Filter } from "../types/domain";
import { useDb } from "../context/dbContext";

export function useChampions() {
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter | undefined>(undefined);
  const [data, setData] = useState<Champion[]>([]);
  const db = useDb();

  const fetchData = async () => {
    setLoading(true);
    try {
      const champions = db.champions.filter((champion) => {
        if (filter?.name) {
          const nameMatch = champion.name
            .toLowerCase()
            .includes(filter.name.toLowerCase());
          if (!nameMatch) return false;
        }
        if (filter?.role) {
          if (!champion.roles.includes(filter.role)) return false;
        }
        if (filter?.championClass) {
          if (!champion.classes.includes(filter.championClass)) return false;
        }
        return true;
      });
      setData(champions);
    } catch (error) {
      console.error("Erro ao carregar campeões");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  return { loading, data, filter, setFilter, refetch: fetchData };
}
