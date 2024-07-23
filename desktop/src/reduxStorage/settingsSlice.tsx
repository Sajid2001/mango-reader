import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserSettings } from "../models/userSettings";




const initialState: UserSettings = {
    theme: "grape",
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
            state.defaultSinglePage = action.payload;
        },

        setDefaultFitHeight: (state, action: PayloadAction<boolean>) => {
            state.defaultFitHeight = action.payload;
        },

        setDefaultLeftToRight: (state, action: PayloadAction<boolean>) => {
            state.defaultLeftToRight = action.payload;
        },

        setPageGap: (state, action: PayloadAction<number>) => {
            state.pageGap = action.payload;
        },

        setLeftPageKeybind: (state, action: PayloadAction<string>) => {
            state.leftPageKeybind = action.payload;
        },

        setRightPageKeybind: (state, action: PayloadAction<string>) => {
            state.rightPageKeybind = action.payload;
        },

        setLeftChapterKeybind: (state, action: PayloadAction<string>) => {
            state.leftChapterKeybind = action.payload;
        },

        setRightChapterKeybind: (state, action: PayloadAction<string>) => {
            state.rightChapterKeybind = action.payload;
        },

        setSidebarKeybind: (state, action: PayloadAction<string>) => {
            state.sidebarKeybind = action.payload;
        },

        setExitKeybind: (state, action: PayloadAction<string>) => {
            state.exitKeybind = action.payload;
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
export const {
    setTheme,
    setFontSize,
    setDownloadPath,
    setLibraryDownloadPath,
    setDefaultSinglePage,
    setDefaultFitHeight,
    setDefaultLeftToRight,
    setPageGap,
    setLeftPageKeybind,
    setRightPageKeybind,
    setLeftChapterKeybind,
    setRightChapterKeybind,
    setSidebarKeybind,
    setExitKeybind,
    resetUserSettings   
} = settingsSlice.actions;

export default settingsSlice.reducer;