import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchFnResponseOptions, fetchFn } from "./fetchFn";
import { SettingsType } from "./hhdSlice";

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async () => {
    const response = await fetchFn("settings");
    return response.result;
  }
);

export const fetchHhdSettingsState = createAsyncThunk(
  "hhd/fetchHhdSettingsState",
  async () => {
    const response = await fetchFn("state");

    return response.result;
  }
);

export const updateHhdSettingsState = createAsyncThunk(
  "hhd/updateHhdSettingsState",
  async (newState: any) => {
    const options: FetchFnResponseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: newState,
    };
    const response = await fetchFn("state", options);

    return response.result;
  }
);
