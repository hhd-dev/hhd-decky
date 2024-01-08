import {
  // getLogInfo,
  getServerApi,
} from "../backend/utils";
import { ServerAPI } from "decky-frontend-lib";

/*
serverApi.callServerMethod(
  "http_request",
  {
    method: "POST",
    headers: { Content-Type: 'application/json' },
    url,
    data: JSON.stringify(data)
  }
)
*/

const getPortNum = async () => {
  const serverApi = getServerApi() as ServerAPI;

  const result = await serverApi.callPluginMethod("retrieve_http_port", {});
  if (result.success) {
    return `${result.result}`;
  }
  // default port
  return 5335;
};

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

export type FetchFnResponseOptions = {
  method: "GET" | "POST";
  headers?: { [key: string]: string };
  body?: any;
};

export const fetchFn = async (
  url: string,
  options?: FetchFnResponseOptions
) => {
  const authHeaders = await getAuthHeaders();
  const port = await getPortNum();
  const serverApi = getServerApi() as ServerAPI;

  if (!options) {
    options = {
      method: "GET",
    };
  }

  options.headers = options?.headers
    ? { ...options.headers, ...authHeaders }
    : authHeaders;

  const response = await serverApi.fetchNoCors(
    `http://127.0.0.1:${port}/api/v1/${url}`,
    //@ts-ignore
    options
  );

  return response;
};
