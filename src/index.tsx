import {
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  ToggleField,
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
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
import {
  selectAllHhdSettingsLoading,
  selectHhdUiVersion,
} from "./redux-modules/hhdSlice";
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

  return (
    <>
      <OneTimeHddOverlayNotification />
      <HhdState />
    </>
  );
};

const AppContainer: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  return (
    <Provider store={store}>
      <ErrorBoundary title="App">
        <Content serverAPI={serverAPI} />
      </ErrorBoundary>
      <ErrorBoundary title="OTA Updates">
        <OtaUpdates />
      </ErrorBoundary>
    </Provider>
  );
};

const ONE_TIME_NOTIFICATION_KEY = "hhd-decky-ONE_TIME_NOTIFICATION_KEY";

function OneTimeHddOverlayNotification() {
  const hasVersionUi = useSelector(selectHhdUiVersion);
  const [checked, setChecked] = useState(
    window.localStorage.getItem(ONE_TIME_NOTIFICATION_KEY) === "true" || false
  );

  if (!Boolean(hasVersionUi)) {
    return null;
  }

  const onChange = (change: boolean) => {
    window.localStorage.setItem(ONE_TIME_NOTIFICATION_KEY, `${change}`);
    setChecked(change);
  };

  if (checked) {
    return null;
  }

  return (
    <PanelSection>
      <PanelSectionRow>
        <ToggleField
          label={"Notice: New hhd overlay now available!"}
          description={
            "Double tap or hold the QAM/Side Menu button to open the new overlay. Click this toggle to dismiss the notice"
          }
          checked={checked}
          onChange={onChange}
        />
      </PanelSectionRow>
    </PanelSection>
  );
}

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
