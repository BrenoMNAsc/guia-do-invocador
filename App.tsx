import { StatusBar } from "react-native";
import { PaperProvider } from "react-native-paper";
import RootNavigation from "./src/navigation";
import { DbProvider } from "./src/context/dbContext";
import { lightTheme } from "./src/theme";

export default function App() {
  return (
    <PaperProvider theme={lightTheme}>
      <DbProvider>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={lightTheme.colors.background}
        />
        <RootNavigation />
      </DbProvider>
    </PaperProvider>
  );
}
