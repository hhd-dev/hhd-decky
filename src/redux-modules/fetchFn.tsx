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

export const fetchFn = async (
  url: string,
  options: { [s: string]: any } = { method: "GET" }
) => {
  const authHeaders = await getAuthHeaders();
  options.headers = { ...options?.headers, ...authHeaders };

  return fetch(`localhost:5335/api/v1/${url}`, options)
    .then((r) => {
      if (r.ok) {
        return r.json();
      }
    })
    .catch(console.log);
};
