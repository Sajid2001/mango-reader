import { Profile } from "./profile";

export interface UserSettings {
  //General Preferences
  theme: string;
  fontSize: number;
  chapterDownloadPath: string;
  libraryDownloadPath: string;

  //Reader Preferences
  profiles: Profile[];
  activeProfile: 0;

  //Keybinds
  leftPageKeybind: string;
  rightPageKeybind: string;
  leftChapterKeybind: string;
  rightChapterKeybind: string;
  sidebarKeybind: string;
  exitKeybind: string;
}
