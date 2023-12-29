import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

type UiStateType = {
  initialLoading: boolean;
  currentGameId: string;
  currentDisplayName: string;
};

const initialState: UiStateType = {
  initialLoading: true,
  currentGameId: "default",
  currentDisplayName: "default",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setCurrentGameInfo: (
      state,
      action: PayloadAction<{ currentGameId: string; displayName: string }>
    ) => {
      state.currentGameId = action.payload.currentGameId;
      state.currentDisplayName = action.payload.displayName;
    },
  },
});

const selectCurrentGameId = (state: RootState) =>
  state.ui?.currentGameId || "default";

const selectCurrentGameDisplayName = (state: RootState) =>
  state.ui?.currentDisplayName || "default";

export const selectCurrentGameInfo = (state: RootState) => {
  const gameId = selectCurrentGameId(state);
  const displayName = selectCurrentGameDisplayName(state);

  return { gameId, displayName };
};
