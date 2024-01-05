import { FC } from "react";
import { SliderField } from "decky-frontend-lib";

type PropType = {
  value: number;
  defaultValue: number;
  title: string;
  hint?: string;
  min: number;
  max: number;
  otherProps?: { [prop: string]: any };
  handleSliderChange?: any;
  disabled: boolean;
};

const HhdIntSlider: FC<PropType> = ({
  value,
  defaultValue,
  title,
  hint,
  min,
  max,
  handleSliderChange,
  disabled,
  otherProps,
  ...extraProps
}) => {
  const onChange = (value: number) => {
    return handleSliderChange(value);
  };

  return (
    <>
      <SliderField
        label={title}
        value={value || defaultValue}
        disabled={disabled}
        min={min}
        max={max}
        step={1}
        showValue
        bottomSeparator={"none"}
        onChange={onChange}
        {...extraProps}
        {...otherProps}
      />
    </>
  );
};

export default HhdIntSlider;
