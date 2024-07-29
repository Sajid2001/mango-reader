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

const getSettings = async () => {
    return settings;
};

const setSettings = async (newSettings: UserSettings) => {
    settings = newSettings;
    await saveSettings();
}

export { loadSettings, saveSettings, getSettings, setSettings };