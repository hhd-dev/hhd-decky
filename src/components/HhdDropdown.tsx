import { DropdownItem } from "decky-frontend-lib";
import { FC } from "react";

type DropdownProps = {
  options: { [value: string]: string };
  defaultValue: string;
  selectedValue: string;
  onChange: any;
  title: string;
  hint?: string;
};

const HhdDropdown: FC<DropdownProps> = ({
  options,
  defaultValue,
  selectedValue,
  onChange,
  title,
  hint,
}) => {
  const dropdownOptions = Object.entries(options).map(([value, label]) => {
    return {
      data: value,
      label,
      value,
    };
  });

  return (
    <DropdownItem
      label={title}
      description={hint}
      rgOptions={dropdownOptions.map((o) => {
        return {
          data: o.data,
          label: o.label,
          value: o.value,
        };
      })}
      selectedOption={
        dropdownOptions.find((o) => {
          return o.data === selectedValue;
        })?.data || defaultValue
      }
      onChange={onChange}
    />
  );
};

export default HhdDropdown;
