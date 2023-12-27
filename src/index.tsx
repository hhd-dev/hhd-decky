import {
  ButtonItem,
  definePlugin,
  DialogButton,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  Router,
  ServerAPI,
  showContextMenu,
  staticClasses,
} from "decky-frontend-lib";
import { VFC } from "react";
import { FaShip } from "react-icons/fa";

import logo from "../assets/logo.png";
import { registerForAppLifetimeNotifications, suspendEventListener } from "./steamListeners";
import { registerServerApi } from "./backend/utils";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux-modules/store";
import { selectAuthToken, selectCurrentGameInfo, uiSlice } from "./redux-modules/uiSlice";

// interface AddMethodArgs {
//   left: number;
//   right: number;
// }

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };
  const { gameId, displayName } = useSelector(selectCurrentGameInfo)
  const authToken = useSelector(selectAuthToken)

  return (
    <PanelSection title={`${gameId} ${displayName} ${authToken}`}>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={(e) =>
            showContextMenu(
              <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                <MenuItem onSelected={() => {}}>Item #3</MenuItem>
              </Menu>,
              e.currentTarget ?? window
            )
          }
        >
          Server says yolo
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={logo} />
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            Router.CloseSideMenus();
            Router.Navigate("/decky-plugin-test");
          }}
        >
          Router
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Router.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

const AppContainer: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {

  return (
    <Provider store={store}>
      <Content serverAPI={serverAPI}/>
    </Provider>
  )
}

export default definePlugin((serverApi: ServerAPI) => {
  registerServerApi(serverApi);

  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  const unregister = registerForAppLifetimeNotifications()
  const unsubscribeToSuspendEvent = suspendEventListener()

  serverApi.callPluginMethod('retrieve_hhd_token', {}).then(
    result =>{
      if (result.success) {
        const authToken = JSON.stringify(result.result) || '';
  
        store.dispatch(
          uiSlice.actions.setAuthToken(authToken)
        );
      }
    }
  );

  return {
    title: <div className={staticClasses.Title}>Example Plugin</div>,
    content: <AppContainer serverAPI={serverApi} />,
    icon: <FaShip />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
      unregister()
      if(unsubscribeToSuspendEvent) {
        unsubscribeToSuspendEvent()
      }
    },
  };
});
