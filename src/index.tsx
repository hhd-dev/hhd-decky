import {
  definePlugin,
  ServerAPI,
  staticClasses,
  SteamSpinner,
  ButtonItem,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";
import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import { getLogInfo, registerServerApi } from "./backend/utils";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux-modules/store";
import { selectCurrentGameInfo } from "./redux-modules/uiSlice";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  selectAllHhdSettings,
  selectAllHhdSettingsLoading,
} from "./redux-modules/hhdSlice";
import HhdContainer, { renderChild } from "./components/HhdContainer";
// import AdvancedOptions from "./components/AdvancedOptions";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const loading = useSelector(selectAllHhdSettingsLoading);
  const settings = useSelector(selectAllHhdSettings);

  if (loading) {
    return <SteamSpinner />;
  }

  return (
    <>
      <HhdContainer
        {...settings.user.settings}
        renderChild={renderChild}
        state={settings.user.state}
      />
      {/* <AdvancedOptions /> */}
    </>
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
  store.dispatch(fetchHhdSettingsState());

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
