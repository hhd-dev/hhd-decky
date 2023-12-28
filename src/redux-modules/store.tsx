import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./uiSlice";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import hhdSlice from "./hhdSlice";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    hhd: hhdSlice.reducer,
  },
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware().concat(),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
