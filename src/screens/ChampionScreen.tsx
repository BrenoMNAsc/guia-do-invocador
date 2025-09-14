import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/domain";
import ChampionView from "../views/ChampionView";

export default function ChampionScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, "Champion">>();
  const id = params?.championId ?? "";

  return <ChampionView id={id} />;
}
