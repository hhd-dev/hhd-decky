import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchFnResponseOptions, fetchFn } from "./fetchFn";
import { set } from "lodash";

export const fetchHhdSettings = createAsyncThunk(
  "hhd/fetchHhdSettings",
  async () => {
    const { result } = await fetchFn("settings");

    //@ts-ignore
    const body = result.body as string;
    if (body && typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  }
);

export const fetchHhdSettingsState = createAsyncThunk(
  "hhd/fetchHhdSettingsState",
  async () => {
    const { result } = await fetchFn("state");
    //@ts-ignore
    const body = result.body as string;
    if (body && typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  }
);

export const updateHhdState = createAsyncThunk(
  "hhd/updateHhdState",
  async ({ path, value }: { path: string; value: any }, thunkApi) => {
    const postBody = set({}, path, value);

    const options: FetchFnResponseOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    };
    const { result } = await fetchFn("state", options);

    //@ts-ignore
    const body = result.body as string;
    if (body && typeof body === "string") {
      return JSON.parse(body);
    }

    return body;
  }
);
