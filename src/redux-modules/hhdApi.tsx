import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getServerApi } from "../backend/utils";
import { fetchFn } from "./fetchFn";

// Define a service using a base URL and expected endpoints
export const hhdApi = createApi({
  reducerPath: "hhdApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:5335/api/v1/",
    prepareHeaders: async (headers, query) => {
      const serverApi = getServerApi();
      if (serverApi) {
        const authResult = await serverApi.callPluginMethod(
          "retrieve_hhd_token",
          {}
        );
        if (authResult.success) {
          const token = `Bearer ${authResult.result}`;
          headers.set("Authorization", token);
        }
      }
      return headers;
    },
    fetchFn,
  }),
  endpoints: (builder) => ({
    getSettings: builder.query<any, void>({
      query: () => `settings`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// export const { useGetSettingsQuery } = hhdApi;
