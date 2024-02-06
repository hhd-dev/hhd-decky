//@ts-nocheck
import { ButtonItem, Field, PanelSection } from "decky-frontend-lib";
import { Component } from "react";
import { getLogInfo } from "../backend/utils";
import { store } from "../redux-modules/store";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchIsSteamDeckMode,
} from "../redux-modules/hhdAsyncThunks";

type PropsType = {
  children: any;
  title?: string;
};
type StateType = {
  hasError: boolean;
  title?: string;
};

class ErrorBoundary extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = { hasError: false, title: props?.title };
  }

  static getDerivedStateFromError(error) {
    const logInfo = getLogInfo();
    logInfo(JSON.stringify(error));
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const logInfo = getLogInfo();

    logInfo({
      error: JSON.stringify(error),
      errorInfo: JSON.stringify(errorInfo),
    });
  }
  render() {
    if (this.state.hasError) {
      if (this.props.title === "App") {
        return (
          <>
            <PanelSection title="App Error">
              <Field disabled label="Error">
                {this.props.title} failed to render
              </Field>
              <ButtonItem
                onClick={() => {
                  store.dispatch(fetchHhdSettings());
                  store.dispatch(fetchHhdSettingsState());
                  store.dispatch(fetchIsSteamDeckMode());
                  this.setState({ hasError: false });
                }}
                layout="below"
                bottomSeparator="none"
              >
                Refresh
              </ButtonItem>
            </PanelSection>
          </>
        );
      }

      return (
        <Field disabled label="Error">
          {this.props.title} failed to render
        </Field>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
