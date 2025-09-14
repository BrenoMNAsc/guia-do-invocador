import { useEffect, useState } from "react";
import { useDb } from "../context/dbContext";
import { Rune } from "../types/domain";
import { useLoading } from "../context/LoadingContext";

export function useRunes() {
  const [runes, setRunes] = useState<Record<string | number, Rune>>({});
  const { setIsLoading } = useLoading();

  const db = useDb();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const runes = db.runes;
      setRunes(runes);
    } catch (error) {
      console.error("Error fetching runes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { runes, refetch: fetchData };
}
