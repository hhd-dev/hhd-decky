import { useDispatch, useSelector } from "react-redux";
import { updateHhdState } from "../redux-modules/hhdAsyncThunks";
import { AppDispatch } from "../redux-modules/store";
import { selectUpdateHhdStatePending } from "../redux-modules/hhdSlice";

export const useSetHhdState = () => {
  const dispatch = useDispatch<AppDispatch>();

  const setter = (path: string, value: any) => {
    const action = updateHhdState({ path, value });
    return dispatch(action);
  };

  return setter;
};

export const useUpdateHhdStatePending = () => {
  const loading = useSelector(selectUpdateHhdStatePending);

  return loading;
};
