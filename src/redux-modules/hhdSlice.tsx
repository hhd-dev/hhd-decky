import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchFn } from "./fetchFn";
import { RootState } from "./store";
import { get } from "lodash";

export type SettingType =
  | "bool"
  | "container"
  | "mode"
  | "discrete"
  | "multiple";

export type SettingsType = {
  type: SettingType;
  title: string;
  default?: any;
  hint?: string;
  children?: { [childName: string]: SettingsType };
};

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async (thunkAPI) => {
    const response = await fetchFn("settings");
    return response.result;
  }
);

interface HhdState {
  settings?: SettingsType;
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState = {
  settings: undefined,
  loading: "idle",
} as HhdState;

// Then, handle actions in your reducers:
const hhdSlice = createSlice({
  name: "hhd",
  initialState,
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchHhdSettings.pending, (state, action) => {
      state.loading = "pending";
    });
    builder.addCase(fetchHhdSettings.fulfilled, (state, action) => {
      // Add user to the state array
      //@ts-ignore
      const body = action.payload.body;
      if (typeof body === "string") {
        state.settings = get(
          JSON.parse(body),
          "controllers.legion_go"
        ) as SettingsType;
        state.loading = "succeeded";
      }
    });
  },
});

// selectors

export const selectHhdSettings = (state: RootState) => {
  return state.hhd.settings;
};
export const selectHhdSettingsLoading = (state: RootState) => state.hhd.loading;

export default hhdSlice;
