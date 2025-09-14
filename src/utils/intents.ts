import { Linking, Share, Platform } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

const ANDROID_ACTION_VIEW = "android.intent.action.VIEW";
const ANDROID_ACTION_SEND = "android.intent.action.SEND";
const EXTRA_TEXT = "android.intent.extra.TEXT";
const EXTRA_SUBJECT = "android.intent.extra.SUBJECT";

export async function openChampionWiki(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  const url = `https://www.leagueoflegends.com/pt-br/champions/${slug}/`;

  if (Platform.OS === "android") {
    try {
      await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, {
        data: url,
      });
      return;
    } catch {}
  }
  await Linking.openURL(url);
}

export async function shareBuild(text: string, title = "Build LoL") {
  if (Platform.OS === "android") {
    try {
      await IntentLauncher.startActivityAsync(ANDROID_ACTION_SEND, {
        type: "text/plain",
        extra: { [EXTRA_TEXT]: text, [EXTRA_SUBJECT]: title },
      });
      return true;
    } catch {}
  }
  try {
    await Share.share({ message: text, title });
    return true;
  } catch {
    return false;
  }
}

export async function openMaps(lat: number, lng: number, label = "Meu local") {
  if (Platform.OS === "android") {
    const data = `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(
      label
    )})`;
    try {
      await IntentLauncher.startActivityAsync(ANDROID_ACTION_VIEW, { data });
      return;
    } catch {}
  }
  const url = `http://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(
    label
  )}`;
  await Linking.openURL(url);
}

export async function openSystemLocationSettings() {
  if (Platform.OS === "android") {
    await IntentLauncher.startActivityAsync(
      IntentLauncher.ActivityAction.LOCATION_SOURCE_SETTINGS
    );
    return;
  }
  try {
    await Linking.openURL("app-settings:");
  } catch {}
}
