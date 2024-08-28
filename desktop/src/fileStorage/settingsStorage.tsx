import { read } from "fs";
import { UserSettings } from "../models/userSettings";

import {
  readDataFromFile,
  replaceFileData,
  writeDataToFile,
} from "./dataManager";

let settings: UserSettings;
const filepath = "settings.json";

const loadSettings = async () => {
  const data = readDataFromFile(filepath);
  if (data) {
    settings = data;
  }
  return settings;
};

const saveSettings = async () => {
  writeDataToFile(filepath, JSON.stringify(settings));
};

const setSettings = async (newSettings: UserSettings) => {
  settings = newSettings;
  await saveSettings();
};

const importSettingsFromFile = async (newSettingsFilepath: string) => {
  if (!isFileOfUserSettings(readDataFromFile(newSettingsFilepath))) {
    throw new Error("File type not supported");
  }
  await replaceFileData(filepath, newSettingsFilepath).catch((err) => {
    //if failed here, it probably means the file couldnt be replaced
    throw new Error(err);
  });
};

function isFileOfUserSettings(jsonData: any): jsonData is UserSettings {
  return (
    typeof jsonData.theme === "string" &&
    typeof jsonData.fontSize === "number" &&
    typeof jsonData.chapterDownloadPath === "string" &&
    typeof jsonData.profiles === "object" &&
    typeof jsonData.activeProfile === "number" &&
    typeof jsonData.leftPageKeybind === "string" &&
    typeof jsonData.rightPageKeybind === "string" &&
    typeof jsonData.leftChapterKeybind === "string" &&
    typeof jsonData.rightChapterKeybind === "string" &&
    typeof jsonData.sidebarKeybind === "string" &&
    typeof jsonData.exitKeybind === "string"
  );
}

export { importSettingsFromFile, loadSettings, saveSettings, setSettings };
