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
import {
  fetchHhdSettings,
  selectHhdSettings,
  selectHhdSettingsLoading,
  SettingsType,
  SettingType,
} from "./redux-modules/hhdSlice";
import HhdContainer from "./components/HhdContainer";

const renderChild = ({
  childName,
  child,
  childOrder,
  parentType,
  fullPath,
  depth,
}: {
  childName: string;
  child: SettingsType;
  parentType: SettingType;
  childOrder: number;
  fullPath: string;
  depth: number;
}) => {
  return (
    <HhdContainer
      key={childOrder}
      childName={childName}
      renderChild={renderChild}
      depth={depth}
      parentType={parentType}
      fullPath={fullPath}
      {...child}
    />
  );
};

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const { displayName } = useSelector(selectCurrentGameInfo);

  const settings = useSelector(selectHhdSettings);
  const loading = useSelector(selectHhdSettingsLoading);

  if (loading === "pending" || !settings) {
    return <SteamSpinner />;
  }

  const { type, title, hint, children } = settings;

  return (
    <HhdContainer
      type={type}
      title={title}
      hint={hint}
      children={children}
      renderChild={renderChild}
    />
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
