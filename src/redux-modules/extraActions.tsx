import { createAction } from "@reduxjs/toolkit";

type SetCurrentGameInfoActionType = {
  displayName: string;
  currentGameId: string;
};

export const setCurrentGameInfo =
  createAction<SetCurrentGameInfoActionType>("setCurrentGameInfo");
export const resumeAction = createAction("resumeAction");
