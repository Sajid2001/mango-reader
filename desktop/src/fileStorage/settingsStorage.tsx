import { LibraryEntry } from "../models/libraryEntry";
import { UserSettings } from "../models/userSettings";

import { readDataFromFile, writeDataToFile } from './dataManager';

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

const clearSettings = async () => {
    settings.theme = "light";
    settings.fontSize = 14;
    await saveSettings();
}


const getSettings = async () => {
    return settings;
};

export { loadSettings, saveSettings, clearSettings, getSettings };