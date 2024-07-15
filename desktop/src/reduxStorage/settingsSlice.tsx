import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSettings } from "../models/userSettings";




const initialState: UserSettings = {
    theme: "light",
    fontSize: 14,
    chapterDownloadPath: "",
    libraryDownloadPath: "",
    defaultSinglePage: false,
    defaultFitHeight: false,
    defaultLeftToRight: false,
    pageGap: 0,
    leftPageKeybind: "",
    rightPageKeybind: "",
    leftChapterKeybind: "",
    rightChapterKeybind: "",
    sidebarKeybind: "",
    exitKeybind: "",
}

const settingsSlice = createSlice({
    name: "userSettings",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<UserSettings>) => {
            state.theme = action.payload.theme;
        },

        setFontSize: (state, action: PayloadAction<UserSettings>) => {
            state.fontSize = action.payload.fontSize;
        },

        setDownloadPath: (state, action: PayloadAction<UserSettings>) => {
            state.chapterDownloadPath = action.payload.chapterDownloadPath;
        },

        setLibraryDownloadPath: (state, action: PayloadAction<UserSettings>) => {
            state.libraryDownloadPath = action.payload.libraryDownloadPath;
        },

        setDefaultSinglePage: (state, action: PayloadAction<UserSettings>) => {
            state.defaultSinglePage = action.payload.defaultSinglePage;
        },

        setDefaultFitHeight: (state, action: PayloadAction<UserSettings>) => {
            state.defaultFitHeight = action.payload.defaultFitHeight;
        },

        setDefaultLeftToRight: (state, action: PayloadAction<UserSettings>) => {
            state.defaultLeftToRight = action.payload.defaultLeftToRight;
        },

        setPageGap: (state, action: PayloadAction<UserSettings>) => {
            state.pageGap = action.payload.pageGap;
        },

        setLeftPageKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.leftPageKeybind = action.payload.leftPageKeybind;
        },

        setRightPageKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.rightPageKeybind = action.payload.rightPageKeybind;
        },

        setLeftChapterKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.leftChapterKeybind = action.payload.leftChapterKeybind;
        },

        setRightChapterKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.rightChapterKeybind = action.payload.rightChapterKeybind;
        },

        setSidebarKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.sidebarKeybind = action.payload.sidebarKeybind;
        },

        setExitKeybind: (state, action: PayloadAction<UserSettings>) => {
            state.exitKeybind = action.payload.exitKeybind;
        },

        resetUserSettings: (state) => {
            state.theme = initialState.theme;
            state.fontSize = initialState.fontSize;
            state.chapterDownloadPath = initialState.chapterDownloadPath;
            state.libraryDownloadPath = initialState.libraryDownloadPath;
            state.defaultSinglePage = initialState.defaultSinglePage;
            state.defaultFitHeight = initialState.defaultFitHeight;
            state.defaultLeftToRight = initialState.defaultLeftToRight;
            state.pageGap = initialState.pageGap;
            state.leftPageKeybind = initialState.leftPageKeybind;
            state.rightPageKeybind = initialState.rightPageKeybind;
            state.leftChapterKeybind = initialState.leftChapterKeybind;
            state.rightChapterKeybind = initialState.rightChapterKeybind;
            state.sidebarKeybind = initialState.sidebarKeybind;
            state.exitKeybind = initialState.exitKeybind;
        }
        
    }
});

export default settingsSlice.reducer;