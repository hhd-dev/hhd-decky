import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { fetchDeckyPluginVersion } from "./hhdAsyncThunks";

type UiStateType = {
  currentGameId: string;
  currentDisplayName: string;
  pluginVersion: string;
};

const initialState: UiStateType = {
  currentGameId: "default",
  currentDisplayName: "default",
  pluginVersion: "",
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
  extraReducers: (builder) => {
    builder.addCase(fetchDeckyPluginVersion.fulfilled, (state, action) => {
      state.pluginVersion = action.payload;
    });
  },
});

export const selectDeckyPluginVersionNum = (state: RootState) => {
  return state.ui.pluginVersion;
};

const selectCurrentGameId = (state: RootState) =>
  state.ui?.currentGameId || "default";

const selectCurrentGameDisplayName = (state: RootState) =>
  state.ui?.currentDisplayName || "default";

export const selectCurrentGameInfo = (state: RootState) => {
  const gameId = selectCurrentGameId(state);
  const displayName = selectCurrentGameDisplayName(state);

  return { gameId, displayName };
};
