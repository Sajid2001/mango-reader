export interface UserSettings {

    //General Preferences
    theme: string
    fontSize: number
    downloadPath: string

    //Reader Preferences
    defaultSinglePage: boolean
    defaultFitHeight: boolean
    defaultLeftToRight: boolean
    pageGap: number

    //Keybinds
    leftPageKeybind: string
    rightPageKeybind: string
    leftChapterKeybind: string
    rightChapterKeybind: string
    sidebarKeybind: string
    exitKeybind: string
}