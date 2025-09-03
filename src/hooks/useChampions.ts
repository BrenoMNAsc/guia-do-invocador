import * as React from "react";
import { championsService } from "../services/championsService";
import { Champion, Role } from "../types/domain";

export function useChampions() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<Champion[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const reload = React.useCallback(async () => {
    try {
      setLoading(true);
      const list = await championsService.list();
      setData(list);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "Erro ao carregar campeões");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    reload();
  }, [reload]);

  const filterBy = (q: string, role: Role | "All") =>
    data.filter(
      (c) =>
        (role === "All" || c.role === role) &&
        c.name.toLowerCase().includes(q.toLowerCase())
    );

  return { loading, error, data, reload, filterBy };
}

export function useChampion(id: string) {
  const [loading, setLoading] = React.useState(true);
  const [champion, setChampion] = React.useState<Champion | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const c = await championsService.byId(id);
        if (active) setChampion(c);
      } catch (e: any) {
        setError(e?.message ?? "Erro ao carregar campeão");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  return { loading, error, champion };
}
