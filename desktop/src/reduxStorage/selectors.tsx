import { RootState } from "./store";

export const selectProfiles = (state: RootState) => state.userSettings.profiles;
