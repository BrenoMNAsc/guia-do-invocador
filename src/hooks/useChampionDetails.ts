import { useEffect, useState } from "react";
import { useLoading } from "../context/LoadingContext";
import { Champion } from "../types/domain";
import { useDb } from "../context/dbContext";

interface UseChampionDetailsProps {
  id: string;
}

export function useChampionDetails({ id }: UseChampionDetailsProps) {
  const [data, setData] = useState<Champion | undefined>(undefined);
  const { isLoading, setIsLoading } = useLoading();

  const db = useDb();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const champion = db.champions.find((c) => c.id === id);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(champion);
    } catch (error) {
      console.error("Erro ao carregar detalhes do campeão");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return { data, isLoading, refetch: fetchData };
}
