import { createContext, ReactNode, useContext, useState } from "react";
import { LoadingOverlay } from "../components/LoadingOverlay";

const LoadingContext = createContext<{
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
} | null>(null);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Carregando...");

  const showLoading = (message?: string) => {
    if (message) {
      setLoadingMessage(message);
    }
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage("Carregando...");
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setIsLoading,
        showLoading,
        hideLoading,
      }}
    >
      {children}
      <LoadingOverlay visible={isLoading} message={loadingMessage} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading deve ser usado dentro de um LoadingProvider");
  }
  return context;
}
