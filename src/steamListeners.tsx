import { extractCurrentGameInfo, getLogInfo } from "./backend/utils";
import { LifetimeNotification } from "decky-frontend-lib";
import { store } from "./redux-modules/store";
import { resumeAction } from "./redux-modules/extraActions";
import { uiSlice } from "./redux-modules/uiSlice";

export const registerForAppLifetimeNotifications = () => {
  const { unregister } =
    window.SteamClient.GameSessions.RegisterForAppLifetimeNotifications(
      (data: LifetimeNotification) => {
        const { bRunning: running } = data;
        const results = extractCurrentGameInfo();

        if (running) {
          store.dispatch(uiSlice.actions.setCurrentGameInfo(results));
        } else {
          store.dispatch(
            uiSlice.actions.setCurrentGameInfo({
              currentGameId: "default",
              displayName: "default",
            })
          );
        }
      }
    );
  return unregister as () => void;
};

export const suspendEventListener = () => {
  try {
    const { unregister } = SteamClient.System.RegisterForOnResumeFromSuspend(
      async () => {
        store.dispatch(resumeAction());
      }
    );

    return unregister as () => void;
  } catch (e) {
    const logInfo = getLogInfo();
    logInfo(e);
  }
  return () => {};
};
