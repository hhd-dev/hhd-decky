import {
  definePlugin,
  ServerAPI,
  staticClasses,
  SteamSpinner,
  ButtonItem,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
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

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const loading = useSelector(selectAllHhdSettingsLoading);

  const { settings, advanced } = useSelector(selectAllHhdSettings);

  if (loading) {
    return <SteamSpinner />;
  }

  return (
    <>
      <HhdContainer
        {...settings.settings}
        renderChild={renderChild}
        state={settings.state}
      />
      <ButtonItem
        layout={"below"}
        bottomSeparator="none"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        Advanced Options
      </ButtonItem>
      {showAdvancedOptions && advanced.settings && advanced.state && (
        <HhdContainer
          {...advanced.settings}
          renderChild={renderChild}
          state={advanced.state}
        />
      )}
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
