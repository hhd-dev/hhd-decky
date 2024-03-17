import { FC, useState } from "react";
import { PanelSectionRow, SliderField } from "decky-frontend-lib";

type PropType = {
  value: number;
  title: string;
  hint?: string;
  min: number;
  max: number;
  otherProps?: { [prop: string]: any };
  handleSliderChange?: any;
};

const HhdIntSlider: FC<PropType> = ({
  value,
  title,
  hint,
  min,
  max,
  handleSliderChange,
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
    <PanelSectionRow>
      <SliderField
        label={title}
        value={sliderValue}
        min={min}
        max={max}
        step={1}
        description={hint}
        showValue
        bottomSeparator={"none"}
        onChange={onChange}
        {...extraProps}
        {...otherProps}
      />
    </PanelSectionRow>
  );
};

export default HhdIntSlider;
