import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
} from "../redux-modules/hhdSlice";
import HhdComponent, { renderChild } from "./HhdComponent";
import { useSetHhdState } from "../hooks/controller";

const HhdState = () => {
  const state = useSelector(selectHhdSettingsState);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);

  const setState = useSetHhdState();

  return (
    <div>
      {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
        if (topLevelStr === "version") {
          return null;
        }
        return (
          <div key={topIdx}>
            {Object.keys(plugins).map((pluginName, idx) => {
              const plugin = plugins[pluginName] as SettingsType;
              const statePath = `${topLevelStr}.${pluginName}`;

              return (
                <HhdComponent
                  key={`${statePath}${topIdx}${idx}`}
                  {...plugin}
                  state={state}
                  renderChild={renderChild}
                  statePath={statePath}
                  updateState={setState}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default HhdState;
