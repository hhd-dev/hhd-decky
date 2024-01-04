import { VFC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import { PanelSection, ToggleField } from "decky-frontend-lib";
import HhdSlider from "./HhdSlider";
import { get } from "lodash";
import HhdDropdown from "./HhdDropdown";
import HhdModesDropdown from "./HhdModesDropdown";
import { useUpdateHhdStatePending } from "../hooks/controller";
import HhdIntSlider from "./HhdIntSlider";
// import { getLogInfo } from "../backend/utils";

interface HhdComponentType extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  updateState: any;
  // e.g. path in state to set/get the currently set value,
  // such as lodash.get(state, 'xinput.ds5e.led_support')
  statePath?: string;
}

const HhdComponent: VFC<HhdComponentType> = ({
  type,
  title,
  childName,
  hint,
  parentType,
  statePath,
  children,
  options,
  min,
  max,
  renderChild,
  modes,
  depth = 0,
  state,
  updateState,
  default: defaultValue,
}) => {
  const updating = useUpdateHhdStatePending();

  const renderChildren = () => {
    if (children)
      return Object.entries(children).map(([childName, child], idx) => {
        return renderChild({
          childName,
          child,
          childOrder: idx,
          depth: depth + 1,
          parentType: type,
          state,
          updateState,
          statePath: statePath ? `${statePath}.${childName}` : `${childName}`,
        });
      });
    return;
  };

  if (depth === 0 && type === "container") {
    // root container type
    return (
      <PanelSection title={title}>
        {renderChild && typeof renderChild === "function" && renderChildren()}
      </PanelSection>
    );
  }
  if (type === "mode" && modes && statePath) {
    // specially handle xinput child
    const value = get(state, `${statePath}.mode`, defaultValue);

    const onChange = ({ value }: { value: number }) => {
      return updateState(`${statePath}.mode`, value);
    };

    return (
      <HhdModesDropdown
        modes={modes}
        defaultValue={defaultValue}
        selectedValue={value}
        title={title}
        depth={depth}
        state={state}
        statePath={statePath}
        updateState={updateState}
        onChange={onChange}
        hint={hint}
        renderChild={renderChild}
        disabled={updating}
      />
    );
  }

  if (type === "bool") {
    // toggle component
    const checked = get(state, `${statePath}`, defaultValue);
    return (
      <ToggleField
        label={title}
        checked={Boolean(checked)}
        onChange={(enabled) => {
          return updateState(`${statePath}`, enabled);
        }}
        disabled={updating}
      />
    );
  }

  if (type === "discrete" && options) {
    // slider component
    const value = get(state, `${statePath}`, defaultValue);

    const handleSliderChange = (value: any) => {
      return updateState(`${statePath}`, value);
    };

    return (
      <HhdSlider
        value={value}
        defaultValue={defaultValue}
        options={options}
        title={title}
        handleSliderChange={handleSliderChange}
        disabled={updating}
      />
    );
  }

  if (type === "int" && min !== undefined && max && min < max) {
    // int slider component
    const value = get(state, `${statePath}`, defaultValue);

    const handleSliderChange = (value: any) => {
      return updateState(`${statePath}`, value);
    };

    return (
      <HhdIntSlider
        value={value}
        defaultValue={defaultValue}
        min={min}
        max={max}
        title={title}
        handleSliderChange={handleSliderChange}
        disabled={updating}
      />
    );
  }

  if (type === "multiple" && options) {
    // dropdown component
    const onChange = ({ value }: { value: number }) => {
      return updateState(`${statePath}`, value);
    };

    return (
      <HhdDropdown
        title={title}
        options={options}
        defaultValue={defaultValue}
        hint={hint}
        selectedValue={get(state, `${statePath}`, defaultValue)}
        onChange={onChange}
        disabled={updating}
      />
    );
  }

  return null;
};

interface HhdChildContainerType extends HhdComponentType {
  child: SettingsType;
  childOrder: number;
}

export const renderChild = ({
  childName,
  child,
  childOrder,
  parentType,
  statePath,
  state,
  updateState,
  depth,
}: HhdChildContainerType) => {
  return (
    <HhdComponent
      key={childOrder}
      childName={childName}
      renderChild={renderChild}
      depth={depth}
      parentType={parentType}
      statePath={statePath}
      state={state}
      updateState={updateState}
      {...child}
    />
  );
};

export default HhdComponent;
