import { getLogInfo, getServerApi } from "../backend/utils";
import { ServerAPI } from "decky-frontend-lib";
import { cloneDeep } from "lodash";

//https://microsoft.github.io/PowerBI-JavaScript/interfaces/_node_modules_typedoc_node_modules_typescript_lib_lib_dom_d_.request.html
const getAuthHeaders = async () => {
  const serverApi = getServerApi() as ServerAPI;

  const headers = {};
  const authResult = await serverApi.callPluginMethod("retrieve_hhd_token", {});
  if (authResult.success) {
    const token = `Bearer ${authResult.result}`;
    headers["Authorization"] = token;
  }
  return headers;
};

export const fetchFn = async (requestInfo: RequestInfo) => {
  const headers = await getAuthHeaders();
  const serverApi = getServerApi() as ServerAPI;

  const logInfo = getLogInfo();
  logInfo(
    `requestInfo ${requestInfo?.method} ${requestInfo?.url} ${requestInfo?.headers}`
  );
  // @ts-ignore
  const url = requestInfo.url as string;
  const method = requestInfo.method as string;
  const body = requestInfo.body;

  const response = await serverApi.fetchNoCors(url, {
    method,
    headers,
    body,
  });

  //   logInfo(response);

  const { result } = response;

  //   'Content-Type: application/json'
  result.headers["Content-Type"] = "application/json";

  result.text = () => {
    const p = new Promise((resolve) => {
      resolve(JSON.stringify(result.body));
    });
    return p;
  };
  result.json = () => {
    return result.body;
  };
  result.ok = response.success;

  result.clone = () => cloneDeep(result);

  return result;
};
