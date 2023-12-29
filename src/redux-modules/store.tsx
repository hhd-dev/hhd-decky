import { configureStore } from "@reduxjs/toolkit";
import { uiSlice } from "./uiSlice";
import hhdSlice from "./hhdSlice";
import { logger } from "./logger";

export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    hhd: hhdSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
