import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchFnResponseOptions, fetchFn } from "./fetchFn";
import { set } from "lodash";

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

export const updateHhdState = createAsyncThunk(
  "hhd/updateHhdState",
  async ({ path, value }: { path: string; value: any }, thunkApi) => {
    const body = set({}, path, value);

    const options: FetchFnResponseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    };
    const response = await fetchFn("state", options);

    return response.result;
  }
);
