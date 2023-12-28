import {
  definePlugin,
  PanelSection,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { FaShip } from "react-icons/fa";
import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import { getLogInfo, getServerApi, registerServerApi } from "./backend/utils";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux-modules/store";
import { selectCurrentGameInfo } from "./redux-modules/uiSlice";
import { hhdApi } from "./redux-modules/hhdApi";
import { get } from "lodash";

// let store = await getSetting<Store>('store', Store.Default);
// let customURL = await getSetting<string>('store-url', 'https://plugins.deckbrew.xyz/plugins');
// let storeURL;
// if (!store) {
//   console.log('Could not get a default store, using Default.');
//   await setSetting('store-url', Store.Default);
//   return fetch('https://plugins.deckbrew.xyz/plugins', {
//     method: 'GET',
//     headers: {
//       'X-Decky-Version': version.current,
//     },
//   }).then((r) => r.json());
// }

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const { data, error, isLoading } = hhdApi.useGetSettingsQuery();

  const [settings, setSettings] = useState({});
  const logInfo = getLogInfo();

  if (isLoading) {
    return (
      <PanelSection title={`Loading`}>
        <></>
      </PanelSection>
    );
  }

  // const result = JSON.parse(data);
  logInfo(`data ${JSON.stringify(data)}`);

  return (
    <PanelSection
      title={`Decky HHD - ${displayName} ${get(
        data,
        "controllers.legion_go.title",
        "None"
      )}`}
    >
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
