import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../redux-modules/store";
import { fetchDeckyPluginVersion } from "../redux-modules/hhdAsyncThunks";
import { selectDeckyPluginVersionNum } from "../redux-modules/uiSlice";
import { Field } from "decky-frontend-lib";

type Props = {
  title: string;
};

const HhdDeckyVersion: FC<Props> = ({ title }) => {
  const versionNum = useSelector(selectDeckyPluginVersionNum);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchDeckyPluginVersion());
  }, []);

  if (!Boolean(versionNum)) {
    return null;
  }

  return (
    <Field disabled label={title}>
      {versionNum}
    </Field>
  );
};

export default HhdDeckyVersion;
