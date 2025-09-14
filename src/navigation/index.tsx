import { View, Image, Text, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ChampionScreen from "../screens/ChampionScreen";
import MapScreen from "../screens/MapScreen";
import { RootStackParamList } from "../types/domain";

const Stack = createNativeStackNavigator<RootStackParamList>();
const BRAND = { color: "#FF8A5B" };

function AppTitle() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          backgroundColor: BRAND.color,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 8,
        }}
      >
        <Image
          source={require("../assets/icon.png")}
          style={{ width: 18, height: 18, resizeMode: "contain" }}
        />
      </View>
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
        Guia{" "}
      </Text>
      <Text style={{ color: "#fff", fontWeight: "400", fontSize: 16 }}>
        do{" "}
      </Text>
      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
        Invocador
      </Text>
    </View>
  );
}

export default function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: BRAND.color },
          headerTintColor: "#fff",
          headerShadowVisible: false,
          headerTitleAlign: "left",
          headerBackTitleVisible: false,
          // não mostra o nome da página: título de branding fixo
          headerTitle: () => <AppTitle />,
          // botão de mapa no topo direito
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Map")}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 4,
              }}
              accessibilityRole="button"
              accessibilityLabel="Abrir mapa"
            >
              <Image
                source={require("../assets/map.png")}
                style={{ width: 18, height: 18, resizeMode: "contain" }}
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Champion" component={ChampionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
