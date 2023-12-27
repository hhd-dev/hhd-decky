import {
  extractCurrentGameInfo,
} from "./backend/utils";
import {
  LifetimeNotification,
} from "decky-frontend-lib"
import { store } from "./redux-modules/store";
import { setCurrentGameInfo, resumeAction } from "./redux-modules/extraActions";

export const registerForAppLifetimeNotifications = () => {
  const { unregister } = window.SteamClient.GameSessions.RegisterForAppLifetimeNotifications((data: LifetimeNotification) => {
    const { bRunning: running } = data;
    const results = extractCurrentGameInfo()

    if(running) {
      store.dispatch(setCurrentGameInfo(results))
    } else {
      store.dispatch(setCurrentGameInfo({ currentGameId: 'default', displayName: 'default'}))
    }
  });
  return unregister as () => void;
}

export const suspendEventListener = () => {
  try {
    const { unregister } = SteamClient.System.RegisterForOnResumeFromSuspend(
      async () => {
        store.dispatch(resumeAction());
      }
    );

    return unregister as () => void;
  } catch (e) {
    console.log(e);
  }
  return () => {}
};
