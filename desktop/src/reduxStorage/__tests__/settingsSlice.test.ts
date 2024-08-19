// src/reduxStorage/__tests__/settingsSlice.test.ts
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  setTheme,
  setFontSize,
  addProfile,
  removeProfile,
  setActiveProfile,
  setDefaultSinglePage,
  resetUserSettings,
} from "../settingsSlice";
import { UserSettings } from "../../models/userSettings";

// Define the initial state
const initialState: UserSettings = {
  theme: "default",
  fontSize: 14,
  chapterDownloadPath: "",
  libraryDownloadPath: "",
  profiles: [
    {
      name: "Default",
      defaultSinglePage: false,
      defaultFitHeight: true,
      defaultLeftToRight: true,
      pageGap: 0,
    },
  ],
  activeProfile: 0,
  leftPageKeybind: "ArrowLeft",
  rightPageKeybind: "ArrowRight",
  leftChapterKeybind: "[",
  rightChapterKeybind: "]",
  sidebarKeybind: "s",
  exitKeybind: "Escape",
};

// Create a mock store for testing
const store = configureStore({ reducer: { userSettings: settingsReducer } });

describe("settingsSlice reducer", () => {
  it("should handle initial state", () => {
    expect(store.getState().userSettings).toEqual(initialState);
  });

  it("should handle setTheme", () => {
    store.dispatch(setTheme("dark"));
    expect(store.getState().userSettings.theme).toBe("dark");
  });

  it("should handle setFontSize", () => {
    store.dispatch(setFontSize(18));
    expect(store.getState().userSettings.fontSize).toBe(18);
  });

  it("should handle addProfile", () => {
    store.dispatch(addProfile("New Profile"));
    expect(store.getState().userSettings.profiles.length).toBe(2);
    expect(store.getState().userSettings.profiles[1].name).toBe("New Profile");
  });

  it("should handle removeProfile", () => {
    store.dispatch(removeProfile(1));
    expect(store.getState().userSettings.profiles.length).toBe(1);
  });

  it("should handle setActiveProfile", () => {
    store.dispatch(setActiveProfile(0));
    expect(store.getState().userSettings.activeProfile).toBe(0);
  });

  it("should handle setDefaultSinglePage", () => {
    store.dispatch(setDefaultSinglePage(true));
    expect(store.getState().userSettings.profiles[0].defaultSinglePage).toBe(
      true
    );
  });

  it("should handle resetUserSettings", () => {
    store.dispatch(setTheme("dark"));
    store.dispatch(resetUserSettings());
    expect(store.getState().userSettings.theme).toBe("default");
  });

  // Add more tests for other reducers
});
