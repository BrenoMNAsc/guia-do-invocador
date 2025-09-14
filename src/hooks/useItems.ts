import { useEffect, useState } from "react";
import { useDb } from "../context/dbContext";
import { Item } from "../types/domain";
import { useLoading } from "../context/LoadingContext";

export function useItems() {
  const [items, setItems] = useState<Record<string | number, Item>>({});
  const { setIsLoading } = useLoading();

  const db = useDb();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const items = db.items;
      setItems(items);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return { items, refetch: fetchData };
}
