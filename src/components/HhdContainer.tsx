import { VFC } from "react";
import { SettingType, SettingsType } from "../redux-modules/hhdSlice";
import { PanelSection, ToggleField } from "decky-frontend-lib";
import HhdSlider from "./HhdSlider";

interface HhdContainer extends SettingsType {
  renderChild?: any;
  depth?: number;
  childName?: string;
  parentType?: SettingType;
  // e.g. path in settings file to set/get value,
  // such as lodash.get(settings, 'children.gyro')
  fullPath?: string;
}

const HhdContainer: VFC<HhdContainer> = ({
  type,
  title,
  childName,
  hint,
  parentType,
  fullPath,
  children,
  options,
  renderChild,
  depth = 0,
  default: defaultValue,
}) => {
  const renderChildren = () => {
    if (children)
      return Object.entries(children).map(([childName, child], idx) => {
        return renderChild({
          childName,
          child,
          childOrder: idx,
          depth: depth + 1,
          parentType: type,
          fullPath: fullPath
            ? `${fullPath}.children.${childName}`
            : `children.${childName}`,
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
  if (type === "mode" && childName === "xinput") {
    // specially handle xinput child

    return null;
  }

  if (type === "bool") {
    // toggle component
    return (
      <ToggleField
        label={title}
        checked={Boolean(defaultValue)}
        // noop for now
        onChange={() => {}}
      />
    );
  }

  if (type === "discrete" && options) {
    // slider component
    return (
      <HhdSlider defaultValue={defaultValue} options={options} title={title} />
    );
  }

  return null;
};

export default HhdContainer;
