import {
  definePlugin,
  PanelSection,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";

import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import { registerServerApi } from "./backend/utils";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux-modules/store";
import {
  selectAuthToken,
  selectCurrentGameInfo,
  selectInitialLoading,
  uiSlice,
} from "./redux-modules/uiSlice";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { gameId, displayName } = useSelector(selectCurrentGameInfo);
  const authToken = useSelector(selectAuthToken);
  const loading = useSelector(selectInitialLoading);

  if (loading) {
    return null;
  }

  return (
    <PanelSection
      title={`${gameId} ${displayName} ${authToken}`}
    ></PanelSection>
  );
};

const AppContainer: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  return (
    <Provider store={store}>
      <Content serverAPI={serverAPI} />
    </Provider>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  registerServerApi(serverApi);

  const unregister = registerForAppLifetimeNotifications();
  const unsubscribeToSuspendEvent = suspendEventListener();

  serverApi.callPluginMethod("retrieve_hhd_token", {}).then((result) => {
    if (result.success) {
      const authToken = JSON.stringify(result.result) || "";

      store.dispatch(uiSlice.actions.setAuthToken(authToken));
    }
  });

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <AppContainer serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      unregister();
      if (unsubscribeToSuspendEvent) {
        unsubscribeToSuspendEvent();
      }
    },
  };
});
