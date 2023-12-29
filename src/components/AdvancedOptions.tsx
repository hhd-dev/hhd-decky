import { ButtonItem } from "decky-frontend-lib";
import { useState, VFC } from "react";
import {
  selectAllHhdSettings,
  selectAllHhdSettingsLoading,
} from "../redux-modules/hhdSlice";
import HhdContainer, { renderChild } from "../components/HhdContainer";
import { useSelector } from "react-redux";

type Props = {
  updateState: any;
};

const AdvancedOptions: VFC<Props> = ({ updateState }) => {
  const loading = useSelector(selectAllHhdSettingsLoading);
  const { advanced } = useSelector(selectAllHhdSettings);

  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  if (loading) {
    return null;
  }

  return (
    <>
      <ButtonItem
        layout={"below"}
        bottomSeparator="none"
        onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
      >
        Advanced Options
      </ButtonItem>
      {showAdvancedOptions && advanced.settings && advanced.state && (
        <HhdContainer
          {...advanced.settings}
          updateState={updateState}
          renderChild={renderChild}
          state={advanced.state}
        />
      )}
    </>
  );
};

export default AdvancedOptions;
