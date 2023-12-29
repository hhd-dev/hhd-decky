import { useDispatch, useSelector } from "react-redux";
import { updateControllerSettingsState } from "../redux-modules/hhdAsyncThunks";
import { AppDispatch } from "../redux-modules/store";
import { selectUpdateControllerSettingsLoading } from "../redux-modules/hhdSlice";

export const useSetControllerInfo = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setter = (path: string, value: any) => {
    const action = updateControllerSettingsState({ path, value });
    return dispatch(action);
  };

  return setter;
};

export const useUpdateControllerStateIsLoading = () => {
  const loading = useSelector(selectUpdateControllerSettingsLoading);

  return loading;
};
