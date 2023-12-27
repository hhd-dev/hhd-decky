import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setCurrentGameInfo, setInitialState } from './extraActions';
import { RootState } from './store';

type UiStateType = {
  initialLoading: boolean;
  currentGameId: string;
  currentDisplayName: string;
  authToken?: string
};

const initialState: UiStateType = {
  initialLoading: true,
  currentGameId: 'default',
  currentDisplayName: 'default',
  authToken: undefined
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.initialLoading = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string> ) => {
      state.authToken = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, action) => {
      if (action) state.initialLoading = false;
    });
    builder.addCase(setCurrentGameInfo, (state, action) => {
      if (action?.payload) {
        state.currentGameId = action.payload.currentGameId;
        state.currentDisplayName = action.payload.displayName
      }
    });
  }
});

export const getInitialLoading = (state: RootState) => state.ui.initialLoading;

const selectCurrentGameId = (state: RootState) => state.ui?.currentGameId || 'default';

const selectCurrentGameDisplayName = (state: RootState) => state.ui?.currentDisplayName || 'default';

export const selectCurrentGameInfo = (state: RootState) => {
  const gameId = selectCurrentGameId(state);
  const displayName = selectCurrentGameDisplayName(state)

  return { gameId, displayName }
}

export const selectAuthToken = (state: RootState) => state.ui.authToken;
