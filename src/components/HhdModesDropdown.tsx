import { DropdownItem } from "decky-frontend-lib";
import { FC } from "react";

type DropdownProps = {
  modes: { [value: string]: any };
  defaultValue: string;
  selectedValue: string;
  title: string;
  depth: number;
  state: any;
  statePath: string;
  updateState: any;
  onChange: any;
  hint?: string;
  renderChild: any;
  disabled: boolean;
  otherProps?: any;
};

const HhdModesDropdown: FC<DropdownProps> = ({
  modes,
  defaultValue,
  selectedValue,
  title,
  hint,
  depth,
  state,
  statePath,
  updateState,
  onChange,
  renderChild,
  otherProps,
  disabled,
}) => {
  const dropdownOptions = Object.entries(modes).map(([value, { title }]) => {
    return {
      data: value,
      label: title,
      value,
    };
  });

  const currentMode = modes[selectedValue];
  const { type } = currentMode;

  const children = Object.entries(currentMode.children);

  return (
    <>
      <DropdownItem
        label={title}
        disabled={disabled}
        description={hint}
        rgOptions={dropdownOptions.map((o) => {
          return {
            data: o.data,
            label: o.label,
            value: o.value,
          };
        })}
        bottomSeparator="none"
        selectedOption={
          dropdownOptions.find((o) => {
            return o.data === selectedValue;
          })?.data || defaultValue
        }
        onChange={onChange}
        {...otherProps}
      />
      {children &&
        children.length > 0 &&
        children.map(([childName, child], idx) => {
          let additionalProps = { bottomSeparator: "none" };
          if (idx == children.length - 1) {
            additionalProps["bottomSeparator"] = "standard";
          }
          return renderChild({
            childName,
            child,
            childOrder: idx,
            depth: depth + 1,
            parentType: type,
            state,
            updateState,
            statePath: `${statePath}.${selectedValue}.${childName}`,
            otherProps: additionalProps,
          });
        })}
    </>
  );
};

export default HhdModesDropdown;
