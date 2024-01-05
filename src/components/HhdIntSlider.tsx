import { FC, useState } from "react";
import { SliderField } from "decky-frontend-lib";

type PropType = {
  value: number;
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
  title,
  hint,
  min,
  max,
  handleSliderChange,
  disabled,
  otherProps,
  ...extraProps
}) => {
  // decky slider components are buggy.
  // Add local state to force rerendering of component
  const [sliderValue, setSliderValue] = useState(value);

  const onChange = (v: number) => {
    handleSliderChange(v);
    setSliderValue(v);
  };

  return (
    <>
      <SliderField
        label={title}
        value={sliderValue}
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
