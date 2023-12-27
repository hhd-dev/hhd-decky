import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setCurrentGameId, setInitialState } from './extraActions';
import { RootState } from './store';

type UiStateType = {
  initialLoading: boolean;
  currentGameId: string;
  currentDisplayName: string;
};

const initialState: UiStateType = {
  initialLoading: true,
  currentGameId: 'default',
  currentDisplayName: 'default',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.initialLoading = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setInitialState, (state, action) => {
      if (action) state.initialLoading = false;
    });
    builder.addCase(setCurrentGameId, (state, action) => {
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