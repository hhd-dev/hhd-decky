import { useDispatch } from "react-redux";
import hhdSlice from "../redux-modules/hhdSlice";

export const useSetControllerInfo = () => {
  const dispatch = useDispatch();

  const setter = (path: string, value: any) => {
    return dispatch(
      hhdSlice.actions.updateControllerSettingsState({ path, value })
    );
  };

  return setter;
};
