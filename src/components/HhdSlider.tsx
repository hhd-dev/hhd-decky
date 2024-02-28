import { FC } from "react";
import { SliderField, NotchLabel, PanelSectionRow } from "decky-frontend-lib";

type PropType = {
  value: number;
  defaultValue: number;
  options: any[];
  title: string;
  hint?: string;
  otherProps?: { [prop: string]: any };
  handleSliderChange?: any;
};

const HhdSlider: FC<PropType> = ({
  value,
  defaultValue,
  options,
  title,
  hint,
  handleSliderChange,
  otherProps,
  ...extraProps
}) => {
  const MODES: NotchLabel[] = options.map((option: number, idx: number) => {
    return { notchIndex: idx, label: `${option}`, value: option };
  });

  const onChange = (value: number) => {
    const newMode = MODES.find((mode) => mode.notchIndex === value);
    return handleSliderChange(newMode?.value);
  };

  const sliderValue =
    options.indexOf(value) >= 0 ? options.indexOf(value) : defaultValue;

  return (
    <PanelSectionRow>
      <SliderField
        label={title}
        value={sliderValue}
        min={0}
        max={MODES.length - 1}
        step={1}
        notchCount={MODES.length}
        notchLabels={MODES}
        notchTicksVisible={true}
        bottomSeparator={"none"}
        onChange={onChange}
        {...otherProps}
        {...extraProps}
      />
    </PanelSectionRow>
  );
};

export default HhdSlider;
