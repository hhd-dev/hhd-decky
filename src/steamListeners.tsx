import {
  extractCurrentGameInfo,
} from "./backend/utils";
import { store } from "./redux-modules/store";
import { setCurrentGameId, resumeAction } from "./redux-modules/extraActions";


let currentGameInfoListenerIntervalId: undefined | number;

export const currentGameInfoListener = () => {
  currentGameInfoListenerIntervalId = window.setInterval(() => {
    const results = extractCurrentGameInfo();

    const { ui } = store.getState();

    if (ui.currentGameId !== results.currentGameId) {
      // new currentGameId, dispatch to the store
      store.dispatch(setCurrentGameId(results));
    }
  }, 500);

  return () => {
    if (currentGameInfoListenerIntervalId) {
      clearInterval(currentGameInfoListenerIntervalId);
    }
  };
};

export const suspendEventListener = () => {
  try {
    const results = SteamClient.System.RegisterForOnResumeFromSuspend(
      async () => {
        store.dispatch(resumeAction());
      }
    );

    return results;
  } catch (e) {
    console.log(e);
  }
};
