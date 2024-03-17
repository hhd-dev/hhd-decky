import { createSlice } from "@reduxjs/toolkit";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  fetchIsSteamDeckMode,
  updateHhdState,
} from "./hhdAsyncThunks";
import { RootState } from "./store";
import { get } from "lodash";

export type SettingType =
  | "bool"
  | "container"
  | "mode"
  | "discrete"
  | "multiple"
  | "int"
  | "display"
  | "action";

export type SettingsType = {
  type: SettingType;
  title: string;
  default?: any;
  hint?: string;
  options?: any;
  modes?: any;
  min?: number;
  max?: number;
  tags?: string[];
  children?: { [childName: string]: SettingsType };
};

interface HhdState {
  perGameProfilesEnabled: boolean;
  isSteamDeckMode: boolean;
  settingsState?: any;
  settings?: any;
  loading: { [loadState: string]: "idle" | "pending" | "succeeded" | "failed" };
}

const initialState = {
  isSteamDeckMode: true,
  perGameProfilesEnabled: false,
  settingsState: undefined,
  settings: undefined,
  loading: {
    settings: "idle",
    settingsState: "idle",
    updateHhdState: "idle",
  },
} as HhdState;

const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchHhdSettings.pending, (state) => {
      state.loading.settings = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      state.settings = action.payload;
      state.loading.settings = "succeeded";
    });
    builder.addCase(fetchHhdSettingsState.pending, (state) => {
      state.loading.settingsState = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.settingsState = "succeeded";
    });

    builder.addCase(updateHhdState.pending, (state) => {
      state.loading.updateHhdState = "pending";
    });
    builder.addCase(updateHhdState.fulfilled, (state, action) => {
      state.settingsState = action.payload;
      state.loading.updateHhdState = "succeeded";
    });
    builder.addCase(fetchIsSteamDeckMode.fulfilled, (state, action) => {
      state.isSteamDeckMode = action.payload;
    });
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};

export const selectHhdSettingsState = (state: RootState) => {
  return state.hhd.settingsState;
};

export const selectUpdateHhdStatePending = (state: RootState) => {
  return state.hhd.loading.updateHhdState === "pending";
};

const selectHhdSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

const selectHhdSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.settingsState;

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectHhdSettingsLoading(state) === "pending" ||
    selectHhdSettingsStateLoading(state) === "pending"
  );
};

export const selectIsSteamDeckMode = (state: RootState) => {
  return state.hhd.isSteamDeckMode;
};

export const selectHhdUiVersion = (state: RootState) => {
  return get(state, "hhd.settings.hhd.settings.children.version_ui", "");
};

export default hhdSlice;
