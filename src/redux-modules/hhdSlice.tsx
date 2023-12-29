import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { get, set } from "lodash";
import {
  fetchHhdSettings,
  fetchHhdSettingsState,
  updateControllerSettingsState,
} from "./hhdAsyncThunks";
import { RootState } from "./store";

export type SettingType =
  | "bool"
  | "container"
  | "mode"
  | "discrete"
  | "multiple"
  | "int";

export type SettingsType = {
  type: SettingType;
  title: string;
  default?: any;
  hint?: string;
  options?: any;
  modes?: any;
  children?: { [childName: string]: SettingsType };
};

interface HhdState {
  settingsState?: any;
  settings?: any;
  loading: { [loadState: string]: "idle" | "pending" | "succeeded" | "failed" };
}

const initialState = {
  settingsState: {},
  settings: {},
  loading: {
    settings: "idle",
    settingsState: "idle",
    updateControllerSettingsState: "idle",
  },
} as HhdState;

const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    updateHhdState: (
      store,
      action: PayloadAction<{ path: string; value: any }>
    ) => {
      const { path, value } = action.payload;
      set(store.settingsState, `controllers.legion_go.${path}`, value);
    },
  },
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

    builder.addCase(updateControllerSettingsState.pending, (state) => {
      state.loading.updateControllerSettingsState = "pending";
    });
    builder.addCase(
      updateControllerSettingsState.fulfilled,
      (state, action) => {
        state.settingsState = action.payload;
        state.loading.updateControllerSettingsState = "succeeded";
      }
    );
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};

const selectHhdSettingsState = (state: RootState) => {
  return state.hhd.settingsState;
};

export const selectAllHhdSettings = (state: RootState) => {
  const settings = selectHhdSettings(state);
  const settingsState = selectHhdSettingsState(state);

  const controllerSettings = get(
    settings,
    "controllers.legion_go"
  ) as SettingsType;
  const advancedSettings = get(settings, "hhd.http") as SettingsType;

  const userState = get(settingsState, "controllers.legion_go");
  const advancedSettingsState = get(settingsState, "hhd.http");

  return {
    controller: {
      settings: controllerSettings,
      state: userState,
    },
    advanced: {
      settings: advancedSettings,
      state: advancedSettingsState,
    },
  };
};

const selectHhdSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

const selectHhdSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.settingsState;

export const selectUpdateControllerSettingsLoading = (state: RootState) => {
  return state.hhd.loading.updateControllerSettingsState === "pending";
};

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectHhdSettingsLoading(state) === "pending" ||
    selectHhdSettingsStateLoading(state) === "pending"
  );
};

export default hhdSlice;
