import { configureStore } from '@reduxjs/toolkit';
import { uiSlice } from './uiSlice';


export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat([
  //   ])
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
