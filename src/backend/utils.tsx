import { ServerAPI, Router } from "decky-frontend-lib";

// export enum ServerAPIMethods {
// }

let serverApi: undefined | ServerAPI;

export const registerServerApi = (s: ServerAPI) => {
  serverApi = s;
};

export const getServerApi = () => {
  return serverApi;
};

export const getLogInfo = () => (info: any) => {
  serverApi?.callPluginMethod("log_to_backend", { info: JSON.stringify(info) });
};

export const extractCurrentGameDisplayName = () =>
  `${Router.MainRunningApp?.display_name || "default"}`;

export const extractCurrentGameId = () =>
  `${Router.MainRunningApp?.appid || "default"}`;

export const extractCurrentGameInfo = () => {
  const displayName = extractCurrentGameDisplayName();
  const currentGameId = extractCurrentGameId();

  return { displayName, currentGameId };
};
