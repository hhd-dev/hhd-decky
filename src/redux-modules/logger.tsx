import { getLogInfo } from "../backend/utils";

export const logger = (store: any) => (next: any) => async (action: any) => {
  const logInfo = getLogInfo();

  await logInfo("before-------------");
  await logInfo(action);
  await logInfo(store.getState());

  const result = next(action);

  await logInfo("after-------------");
  await logInfo(action);
  await logInfo(store.getState());
  return result;
};
