import { createAction } from '@reduxjs/toolkit';

type SetCurrentGameIdActionType = {
    displayName: string;
    currentGameId: string;
}

export const setInitialState = createAction<any>('setInitialState');
export const setCurrentGameId = createAction<SetCurrentGameIdActionType>('setCurrentGameId');
export const resumeAction = createAction('resumeAction');