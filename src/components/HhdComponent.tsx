import { VFC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import {
  ButtonItem,
  Field,
  PanelSection,
  PanelSectionRow,
  ToggleField,
} from "decky-frontend-lib";
import HhdSlider from "./HhdSlider";
import { get } from "lodash";
import HhdDropdown from "./HhdDropdown";
import HhdModesDropdown from "./HhdModesDropdown";
import { useUpdateHhdStatePending } from "../hooks/controller";
import HhdIntSlider from "./HhdIntSlider";
import HhdDeckyVersion from "./HhdDeckyVersion";
import ArrowToggleButton from "./ArrowToggleButton";
import ErrorBoundary from "./ErrorBoundary";
// import { getLogInfo } from "../backend/utils";

const noop = () => {};

interface HhdComponentType extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  state: any;
  updateState: any;
  isSteamDeckMode: boolean;
  otherProps?: { [prop: string]: any };
  // e.g. path in state to set/get the currently set value,
  // such as lodash.get(state, 'xinput.ds5e.led_support')
  statePath?: string;
}

export const shouldRenderChild = (tags: string[], isSteamDeckMode: boolean) => {
  if (tags.indexOf("advanced") >= 0) {
    // don't render advanced values
    return false;
  }

  if (
    tags.indexOf("hhd-update-decky") >= 0 ||
    tags.indexOf("hhd-version-display-decky") >= 0
  ) {
    return false;
  }

  if (isSteamDeckMode && tags.indexOf("non_steamdeck") >= 0) {
    // don't render bpm only values
    return false;
  }

  return true;
};

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
  otherProps,
  tags,
  isSteamDeckMode,
  default: defaultValue,
}) => {
  const updating = useUpdateHhdStatePending();

  if (tags && !shouldRenderChild(tags, isSteamDeckMode)) {
    return null;
  }

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
          otherProps,
          tags,
          isSteamDeckMode,
          statePath: statePath ? `${statePath}.${childName}` : `${childName}`,
        });
      });
    return;
  };

  if (type === "container") {
    // root container type
    return (
      <PanelSection title={title}>
        <ArrowToggleButton cacheKey={`${statePath} ${title}`}>
          {renderChild && typeof renderChild === "function" && renderChildren()}
        </ArrowToggleButton>
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
        onChange={updating ? noop : onChange}
        hint={hint}
        otherProps={otherProps}
        renderChild={renderChild}
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
          if (updating) {
            return;
          }
          return updateState(`${statePath}`, enabled);
        }}
        disabled={updating}
        {...otherProps}
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
        handleSliderChange={updating ? noop : handleSliderChange}
        otherProps={otherProps}
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
        min={min}
        max={max}
        title={title}
        handleSliderChange={updating ? noop : handleSliderChange}
        otherProps={otherProps}
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
        onChange={updating ? noop : onChange}
        otherProps={otherProps}
      />
    );
  }

  if (type === "display" && title) {
    // show info, shouldn't be interactive
    const value = get(state, `${statePath}`);

    return (
      <Field disabled label={title}>
        {value}
      </Field>
    );
  }

  if (type === "action" && title) {
    return (
      <PanelSectionRow>
        <ButtonItem
          onClick={() => updateState(`${statePath}`, true)}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          layout={"below"}
        >
          {title}
        </ButtonItem>
      </PanelSectionRow>
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
  otherProps,
  isSteamDeckMode,
  tags,
  depth,
}: HhdChildContainerType) => {
  return (
    <ErrorBoundary title={childName}>
      <HhdComponent
        key={childOrder}
        childName={childName}
        renderChild={renderChild}
        depth={depth}
        parentType={parentType}
        statePath={statePath}
        state={state}
        isSteamDeckMode={isSteamDeckMode}
        updateState={updateState}
        otherProps={otherProps}
        tags={tags}
        {...child}
      />
    </ErrorBoundary>
  );
};

export default HhdComponent;
