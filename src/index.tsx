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
import { selectCurrentGameInfo } from "./redux-modules/uiSlice";
import { hhdApi } from "./redux-modules/hhdApi";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const { data, error, isLoading } = hhdApi.useGetSettingsQuery();

  if (isLoading) {
    return (
      <PanelSection title={`Loading`}>
        <></>
      </PanelSection>
    );
  }

  return (
    <PanelSection title={`Decky HHD - ${displayName}`}>
      <></>
    </PanelSection>
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
