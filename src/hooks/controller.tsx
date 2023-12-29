import { useDispatch } from "react-redux";
import { updateControllerSettingsState } from "../redux-modules/hhdAsyncThunks";
import { AppDispatch } from "../redux-modules/store";

export const useSetControllerInfo = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setter = (path: string, value: any) => {
    const action = updateControllerSettingsState({ path, value });
    return dispatch(action);
  };

  return setter;
};
