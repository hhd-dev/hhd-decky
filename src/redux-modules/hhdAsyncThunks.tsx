import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchFn } from "./fetchFn";

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
