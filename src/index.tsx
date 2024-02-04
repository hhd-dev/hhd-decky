import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { useEffect, VFC } from "react";
import { FaGamepad } from "react-icons/fa";
import {
  registerForAppLifetimeNotifications,
  suspendEventListener,
} from "./steamListeners";
import {
  // getLogInfo,
  registerServerApi,
} from "./backend/utils";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, store } from "./redux-modules/store";
import { selectCurrentGameInfo } from "./redux-modules/uiSlice";
import { selectAllHhdSettingsLoading } from "./redux-modules/hhdSlice";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchIsSteamDeckMode,
} from "./redux-modules/hhdAsyncThunks";
import HhdState from "./components/HhdState";
import ErrorBoundary from "./components/ErrorBoundary";
import OtaUpdates from "./components/OtaUpdates";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const loading = useSelector(selectAllHhdSettingsLoading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
    dispatch(fetchIsSteamDeckMode());
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <HhdState />
      {/* <ErrorBoundary title="OTA Updates">
        <OtaUpdates />
      </ErrorBoundary> */}
    </>
  );
};

const AppContainer: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  return (
    <Provider store={store}>
      <ErrorBoundary title="App">
        <Content serverAPI={serverAPI} />
      </ErrorBoundary>
    </Provider>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  registerServerApi(serverApi);

  // fetches data from hhd backend even if React component tree isn't mounted
  store.dispatch(fetchHhdSettings());
  store.dispatch(fetchHhdSettingsState());
  store.dispatch(fetchIsSteamDeckMode());

  // listen to steam for changes, this runs outside of react
  const unregister = registerForAppLifetimeNotifications();
  const unsubscribeToSuspendEvent = suspendEventListener();

  return {
    title: <div className={staticClasses.Title}>Handheld Daemon</div>,
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
