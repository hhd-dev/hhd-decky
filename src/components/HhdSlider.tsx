import { FC } from "react";
import { SliderField, NotchLabel } from "decky-frontend-lib";

type PropType = {
  defaultValue: number;
  options: any[];
  title: string;
  hint?: string;
  handleSliderChange?: any;
};

const HhdSlider: FC<PropType> = ({
  defaultValue,
  options,
  title,
  hint,
  handleSliderChange = () => {},
  ...otherProps
}) => {
  const MODES: NotchLabel[] = options.map((option: string, idx: number) => {
    return { notchIndex: idx, label: `${option}`, value: idx };
  });

  return (
    <>
      <SliderField
        label={title}
        value={defaultValue}
        min={0}
        max={MODES.length - 1}
        step={1}
        notchCount={MODES.length}
        notchLabels={MODES}
        notchTicksVisible={true}
        showValue
        bottomSeparator={"none"}
        onChange={handleSliderChange}
        {...otherProps}
      />
    </>
  );
};

export default HhdSlider;
