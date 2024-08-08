import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSettings } from "../models/userSettings";

const initialState: UserSettings = {
  theme: "default",
  fontSize: 14,
  chapterDownloadPath: "",
  libraryDownloadPath: "",
  profiles: [
    {
      name: "default",
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

interface keybindChangeInfo {
  key: string;
  map: string;
}

const settingsSlice = createSlice({
  name: "userSettings",
  initialState,
  reducers: {
    setAllSettings: (state, action: PayloadAction<UserSettings>) => {
      state.theme = action.payload.theme;
      state.fontSize = action.payload.fontSize;
      state.chapterDownloadPath = action.payload.chapterDownloadPath;
      state.libraryDownloadPath = action.payload.libraryDownloadPath;
      state.profiles = action.payload.profiles;
      state.leftPageKeybind = action.payload.leftPageKeybind;
      state.rightPageKeybind = action.payload.rightPageKeybind;
      state.leftChapterKeybind = action.payload.leftChapterKeybind;
      state.rightChapterKeybind = action.payload.rightChapterKeybind;
      state.sidebarKeybind = action.payload.sidebarKeybind;
      state.exitKeybind = action.payload.exitKeybind;
    },

    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },

    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },

    setDownloadPath: (state, action: PayloadAction<string>) => {
      state.chapterDownloadPath = action.payload;
    },

    setLibraryDownloadPath: (state, action: PayloadAction<string>) => {
      state.libraryDownloadPath = action.payload;
    },

    setDefaultSinglePage: (state, action: PayloadAction<boolean>) => {
      state.profiles[state.activeProfile].defaultSinglePage = action.payload;
    },

    setDefaultFitHeight: (state, action: PayloadAction<boolean>) => {
      state.profiles[state.activeProfile].defaultFitHeight = action.payload;
    },

    setDefaultLeftToRight: (state, action: PayloadAction<boolean>) => {
      state.profiles[state.activeProfile].defaultLeftToRight = action.payload;
    },

    setPageGap: (state, action: PayloadAction<number>) => {
      state.profiles[state.activeProfile].pageGap = action.payload;
    },

    changeKeybind: (
      state,
      action: PayloadAction<{ key: string; map: string }>
    ) => {
      const key = action.payload.key;

      if (state.leftChapterKeybind === key)
        state.leftChapterKeybind = "No Key Selected";
      if (state.rightChapterKeybind === key)
        state.rightChapterKeybind = "No Key Selected";
      if (state.leftPageKeybind === key)
        state.leftPageKeybind = "No Key Selected";
      if (state.rightPageKeybind === key)
        state.rightPageKeybind = "No Key Selected";
      if (state.sidebarKeybind === key)
        state.sidebarKeybind = "No Key Selected";
      if (state.exitKeybind === key) state.exitKeybind = "No Key Selected";

      switch (action.payload.map) {
        case "leftChapterKeybind":
          state.leftChapterKeybind = key;
          break;
        case "rightChapterKeybind":
          state.rightChapterKeybind = key;
          break;
        case "leftPageKeybind":
          state.leftPageKeybind = key;
          break;
        case "rightPageKeybind":
          state.rightPageKeybind = key;
          break;
        case "sidebarKeybind":
          state.sidebarKeybind = key;
          break;
        case "exitKeybind":
          state.exitKeybind = key;
          break;
      }
    },

    resetUserSettings: (state) => {
      state.theme = initialState.theme;
      state.fontSize = initialState.fontSize;
      state.chapterDownloadPath = initialState.chapterDownloadPath;
      state.libraryDownloadPath = initialState.libraryDownloadPath;
      state.profiles = initialState.profiles;
      state.activeProfile = initialState.activeProfile;
      state.leftPageKeybind = initialState.leftPageKeybind;
      state.rightPageKeybind = initialState.rightPageKeybind;
      state.leftChapterKeybind = initialState.leftChapterKeybind;
      state.rightChapterKeybind = initialState.rightChapterKeybind;
      state.sidebarKeybind = initialState.sidebarKeybind;
      state.exitKeybind = initialState.exitKeybind;
    },
  },
});
export const {
  setAllSettings,
  setTheme,
  setFontSize,
  setDownloadPath,
  setLibraryDownloadPath,
  setDefaultSinglePage,
  setDefaultFitHeight,
  setDefaultLeftToRight,
  setPageGap,
  resetUserSettings,
  changeKeybind,
} = settingsSlice.actions;

export default settingsSlice.reducer;
