import { createContext, ReactNode, useContext } from "react";
import { buildDb, DbShape } from "../constants/data/buildDb";

const DbContext = createContext<DbShape | undefined>(undefined);

interface DbProviderProps {
  children: ReactNode;
}

export function DbProvider({ children }: DbProviderProps) {
  const db = buildDb();

  return <DbContext.Provider value={db}>{children}</DbContext.Provider>;
}

export function useDb() {
  const context = useContext(DbContext);
  if (context === undefined) {
    throw new Error("useDb precisa ser usado dentro de um DbProvider");
  }
  return context;
}
