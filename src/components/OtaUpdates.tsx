import { useEffect } from "react";
import { getServerApi, otaUpdate } from "../backend/utils";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDeckyPluginVersionNum,
  selectLatestDeckyPluginVersionNum,
} from "../redux-modules/uiSlice";
import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
} from "decky-frontend-lib";
import { AppDispatch } from "../redux-modules/store";
import {
  fetchDeckyPluginVersion,
  fetchLatestPluginVersion,
} from "../redux-modules/hhdAsyncThunks";
import ArrowToggleButton from "./ArrowToggleButton";

const OtaUpdates = () => {
  const installedVersionNum = useSelector(selectDeckyPluginVersionNum);
  const latestVersionNum = useSelector(selectLatestDeckyPluginVersionNum);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDeckyPluginVersion());
    dispatch(fetchLatestPluginVersion());
  }, []);

  let buttonText = `Reinstall Plugin`;

  if (installedVersionNum !== latestVersionNum && Boolean(latestVersionNum)) {
    buttonText = `Update to ${latestVersionNum}`;
  }

  return (
    <PanelSection title="Decky Version">
      <ArrowToggleButton cacheKey="hhd.arrowToggleButton.otaUpdates">
        <PanelSectionRow>
          <Field disabled label={"Installed Version"}>
            {installedVersionNum}
          </Field>
        </PanelSectionRow>

        {Boolean(latestVersionNum) && (
          <PanelSectionRow>
            <Field disabled label={"Latest Version"}>
              {latestVersionNum}
            </Field>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ButtonItem
            onClick={() => {
              const serverApi = getServerApi();
              if (serverApi) otaUpdate(serverApi);
            }}
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            layout={"below"}
          >
            {buttonText}
          </ButtonItem>
        </PanelSectionRow>
      </ArrowToggleButton>
    </PanelSection>
  );
};

export default OtaUpdates;
