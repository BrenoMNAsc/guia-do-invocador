import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { championsService } from "./championsService";

const TASK_NAME = "background-build-sync";

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    await championsService.list();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  await BackgroundFetch.registerTaskAsync(TASK_NAME, {
    minimumInterval: 15 * 60,
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
