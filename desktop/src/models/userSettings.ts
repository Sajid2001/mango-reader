import { Profile } from "./profile";

export interface UserSettings {
  //General Preferences
  theme: string;
  fontSize: number;
  chapterDownloadPath: string;

  //Reader Preferences
  profiles: Profile[];
  activeProfile: number;

  //Keybinds
  leftPageKeybind: string;
  rightPageKeybind: string;
  leftChapterKeybind: string;
  rightChapterKeybind: string;
  sidebarKeybind: string;
  exitKeybind: string;
}
