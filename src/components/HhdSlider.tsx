import { FC } from "react";
import { SliderField, NotchLabel } from "decky-frontend-lib";

type PropType = {
  value: number;
  defaultValue: number;
  options: any[];
  title: string;
  hint?: string;
  handleSliderChange?: any;
};

const HhdSlider: FC<PropType> = ({
  value,
  defaultValue,
  options,
  title,
  hint,
  handleSliderChange = () => {},
  ...otherProps
}) => {
  const MODES: NotchLabel[] = options.map((option: number, idx: number) => {
    return { notchIndex: idx, label: `${option}`, value: option };
  });

  return (
    <>
      <SliderField
        label={title}
        value={options.indexOf(value || defaultValue)}
        min={0}
        max={MODES.length - 1}
        step={1}
        notchCount={MODES.length}
        notchLabels={MODES}
        notchTicksVisible={true}
        bottomSeparator={"none"}
        onChange={handleSliderChange}
        {...otherProps}
      />
    </>
  );
};

export default HhdSlider;
