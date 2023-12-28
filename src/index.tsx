import {
  definePlugin,
  PanelSection,
  ServerAPI,
  staticClasses,
  SteamSpinner,
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
import { get } from "lodash";
import {
  fetchHhdSettings,
  selectHhdSettings,
  selectHhdSettingsLoading,
} from "./redux-modules/hhdSlice";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);

  const settings = useSelector(selectHhdSettings);
  const loading = useSelector(selectHhdSettingsLoading);

  if (loading === "pending") {
    return <SteamSpinner />;
  }

  return (
    <PanelSection
      title={`Decky HHD - ${displayName} ${get(
        settings,
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

  store.dispatch(fetchHhdSettings());

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
