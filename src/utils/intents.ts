import { Linking, Share, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

export async function openChampionWiki(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  await Linking.openURL(
    `https://www.leagueoflegends.com/pt-br/champions/${slug}/`
  );
}

export async function shareBuild(text: string) {
  await Share.share({ message: text });
}

export async function openMaps(lat: number, lng: number, label = "Meu local") {
  const geo = Platform.select({
    android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`,
    ios: `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
      label
    )}`,
  });
  if (geo) await Linking.openURL(geo);
}

export async function openSystemLocationSettings() {
  await IntentLauncher.startActivityAsync(
    IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
  );
}
