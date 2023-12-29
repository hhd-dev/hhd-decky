import {
  definePlugin,
  ServerAPI,
  staticClasses,
  SteamSpinner,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaGamepad } from "react-icons/fa";
import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import {
  // getLogInfo,
  registerServerApi,
} from "./backend/utils";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux-modules/store";
import { selectCurrentGameInfo } from "./redux-modules/uiSlice";
import {
  selectAllHhdSettings,
  selectAllHhdSettingsLoading,
} from "./redux-modules/hhdSlice";
import HhdContainer, { renderChild } from "./components/HhdContainer";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
} from "./redux-modules/hhdAsyncThunks";
import { useSetControllerInfo } from "./hooks/controller";
// import AdvancedOptions from "./components/AdvancedOptions";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const loading = useSelector(selectAllHhdSettingsLoading);
  const settings = useSelector(selectAllHhdSettings);
  const updateState = useSetControllerInfo();

  if (loading) {
    return <SteamSpinner />;
  }

  return (
    <>
      <HhdContainer
        {...settings.controller.settings}
        renderChild={renderChild}
        state={settings.controller.state}
        updateState={updateState}
      />
      {/* <AdvancedOptions updateState={updateState} /> */}
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

  // fetches data from hhd backend even if React component tree isn't mounted
  store.dispatch(fetchHhdSettings());
  store.dispatch(fetchHhdSettingsState());

  // listen to steam for changes, this runs outside of react
  const unregister = registerForAppLifetimeNotifications();
  const unsubscribeToSuspendEvent = suspendEventListener();

  return {
    title: <div className={staticClasses.Title}>HHD</div>,
    content: <AppContainer serverAPI={serverApi} />,
    icon: <FaGamepad />,
    onDismount() {
      unregister();
      if (unsubscribeToSuspendEvent) {
        unsubscribeToSuspendEvent();
      }
    },
  };
});
