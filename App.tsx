import * as React from "react";
import { StatusBar } from "react-native";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { registerBackgroundSync } from "./src/services/backgroundSync";
import RootNavigation from "./src/navigation";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF8A65",
    secondary: "#FFD180",
    surface: "#2B2B2B",
    background: "#1F1F1F",
    onSurface: "#FFFFFF",
  },
};

export default function App() {
  React.useEffect(() => {
    registerBackgroundSync();
  }, []);
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" />
      <RootNavigation />
    </PaperProvider>
  );
}
