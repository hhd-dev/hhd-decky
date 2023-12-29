import { getLogInfo } from "../backend/utils";

export const logger = (store: any) => (next: any) => (action: any) => {
  const logInfo = getLogInfo();

  logInfo("before-------------");
  logInfo(action);
  logInfo(store.getState());

  const result = next(action);

  logInfo("after-------------");
  logInfo(action);
  logInfo(store.getState());
  return result;
};
