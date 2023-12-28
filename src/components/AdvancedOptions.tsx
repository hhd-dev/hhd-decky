import { ButtonItem } from "decky-frontend-lib";
import { useState } from "react";
import {
  selectAllHhdSettings,
  selectAllHhdSettingsLoading,
} from "../redux-modules/hhdSlice";
import HhdContainer, { renderChild } from "../components/HhdContainer";
import { useSelector } from "react-redux";

const AdvancedOptions = () => {
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
          renderChild={renderChild}
          state={advanced.state}
        />
      )}
    </>
  );
};

export default AdvancedOptions;
