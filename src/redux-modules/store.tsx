import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./uiSlice";
import { hhdApi } from "./hhdApi";
import { setupListeners } from "@reduxjs/toolkit/query/react";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    [hhdApi.reducerPath]: hhdApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([hhdApi.middleware]),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
