import { MangaDetails } from "../models/mangaDetails";

import { readDataFromFile, writeDataToFile } from './dataManager';

let library: MangaDetails[] = [];
const filepath = "library.json";

const loadLibrary = () => {
    library = readDataFromFile(filepath) || [];
};

const saveLibrary = () => {
    writeDataToFile(filepath, JSON.stringify(library));
};

const addEntryToLibrary = (entry: MangaDetails) => {
    library.push(entry);
    saveLibrary();
};

const removeEntryFromLibrary = (entry: MangaDetails) => {
    library = library.filter((manga) => manga.mangaId !== entry.mangaId);
    saveLibrary();
}

const getLibrary = () => {
    return library;
};

export { loadLibrary, addEntryToLibrary, removeEntryFromLibrary, getLibrary };