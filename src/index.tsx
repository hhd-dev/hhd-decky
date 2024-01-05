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
} from "./redux-modules/hhdAsyncThunks";
import HhdState from "./components/HhdState";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);
  const loading = useSelector(selectAllHhdSettingsLoading);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchHhdSettings());
    dispatch(fetchHhdSettingsState());
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <HhdState />
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
