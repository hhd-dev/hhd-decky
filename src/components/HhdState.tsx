import { useSelector } from "react-redux";
import {
  SettingsType,
  selectHhdSettingsState,
  selectHhdSettings,
  selectIsSteamDeckMode,
} from "../redux-modules/hhdSlice";
import HhdComponent, { shouldRenderChild, renderChild } from "./HhdComponent";
import { useSetHhdState } from "../hooks/controller";

const HhdState = () => {
  const state = useSelector(selectHhdSettingsState);
  const isSteamDeckMode = useSelector(selectIsSteamDeckMode);
  const settings: { [key: string]: { [key: string]: SettingsType } } =
    useSelector(selectHhdSettings);

  const setState = useSetHhdState();

  return (
    <div>
      {Object.entries(settings).map(([topLevelStr, plugins], topIdx) => {
        if (shouldNotRenderParent(plugins, isSteamDeckMode)) {
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
                  isSteamDeckMode={isSteamDeckMode}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const shouldNotRenderParent = (
  plugins: { [key: string]: SettingsType },
  isSteamDeckMode: boolean
) => {
  const shouldRenderChildrenValues = Object.values(plugins).map((p) => {
    const children = p.children;

    if (!children) {
      return false;
    }

    const res = Object.values(children).map((c) => {
      const { tags } = c;
      if (!tags) {
        return true;
      }
      return shouldRenderChild(tags, isSteamDeckMode);
    });

    // if there's any true values
    // this means there is a child that should be rendered
    return res.indexOf(true) >= 0;
  });
  if (shouldRenderChildrenValues.indexOf(true) == -1) {
    // if there's no `true` value, that means all children should not be rendered
    // so don't render the parent either
    return true;
  }
  return false;
};

export default HhdState;
