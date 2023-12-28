import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchFn } from "./fetchFn";
import { RootState } from "./store";
import { get } from "lodash";
import { getLogInfo } from "../backend/utils";

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
  options?: any[];
  children?: { [childName: string]: SettingsType };
};

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async (thunkAPI) => {
    const response = await fetchFn("settings");
    return response.result;
  }
);

export const fetchHhdSettingsState = createAsyncThunk(
  "hhd/fetchHhdSettingsState",
  async (thunkAPI) => {
    const response = await fetchFn("state");
    // const logInfo = getLogInfo();
    // logInfo(response.result);
    return response.result;
  }
);

interface HhdState {
  settings?: SettingsType;
  advancedSettings?: SettingsType;
  settingsState?: any;
  advancedSettingsState?: any;
  loading: { [loadState: string]: "idle" | "pending" | "succeeded" | "failed" };
}

const initialState = {
  settings: undefined,
  advancedSettings: undefined,
  settingsState: undefined,
  advancedSettingsState: undefined,
  loading: { settings: "idle", settingsState: "idle" },
} as HhdState;

// Then, handle actions in your reducers:
const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder.addCase(fetchHhdSettings.pending, (state, action) => {
      state.loading.settings = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      //@ts-ignore
      const body = action.payload.body;
      if (typeof body === "string") {
        const parsedBody = JSON.parse(body);
        state.settings = get(
          parsedBody,
          "controllers.legion_go"
        ) as SettingsType;
        state.advancedSettings = get(parsedBody, "hhd.http");
        state.loading.settings = "succeeded";
      }
    });
    builder.addCase(fetchHhdSettingsState.pending, (state, action) => {
      state.loading.settingsState = "pending";
    });
    builder.addCase(fetchHhdSettingsState.fulfilled, (state, action) => {
      //@ts-ignore
      const body = action.payload.body;
      if (typeof body === "string") {
        const parsedBody = JSON.parse(body);
        state.settingsState = get(parsedBody, "controllers.legion_go");
        state.advancedSettingsState = get(parsedBody, "hhd.http");
        state.loading.settingsState = "succeeded";
      }
    });
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};

export const selectAdvancedHhdSettings = (state: RootState) => {
  return state.hhd.advancedSettings;
};

export const selectHhdSettingsState = (state: RootState) => {
  return state.hhd.settingsState;
};

export const selectAdvancedHhdSettingsState = (state: RootState) => {
  return state.hhd.advancedSettingsState;
};

export const selectAllHhdSettings = (state: RootState) => {
  const settings = selectHhdSettings(state) as SettingsType;
  const settingsState = selectHhdSettingsState(state);
  const advancedSettings = selectAdvancedHhdSettings(state);
  const advancedSettingsState = selectAdvancedHhdSettingsState(state);

  return {
    settings: {
      settings: settings,
      state: settingsState,
    },
    advanced: {
      settings: advancedSettings,
      state: advancedSettingsState,
    },
  };
};

export const selectHhdSettingsLoading = (state: RootState) =>
  state.hhd.loading.settings;

export const selectHhdSettingsStateLoading = (state: RootState) =>
  state.hhd.loading.settingsState;

export const selectAllHhdSettingsLoading = (state: RootState) => {
  return (
    selectHhdSettingsLoading(state) === "succeeded" &&
    selectHhdSettingsStateLoading(state) === "succeeded"
  );
};

export default hhdSlice;
