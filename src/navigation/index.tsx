import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ShareBuildScreen from "../screens/ShareBuildScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Guia do Invocador" }}
        />
        {/* <Stack.Screen
            name="Champion"
            component={ChampionScreen}
            options={{ title: "Build" }}
          /> */}
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Mapa" }}
        />
        <Stack.Screen
          name="Share"
          component={ShareBuildScreen}
          options={{ title: "Compartilhar Build" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
