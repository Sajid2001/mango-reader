import { LibraryEntry } from "../models/libraryEntry";

import { readDataFromFile, writeDataToFile } from './dataManager';

let library: LibraryEntry[] = [];
const filepath = "library.json";

const loadLibrary = async () => {
    const data = readDataFromFile(filepath);
    if (data) {
        library = data;
    }
    return library;

};

const saveLibrary = async () => {
    writeDataToFile(filepath, JSON.stringify(library));
};

const addEntryToLibrary = async (entry: LibraryEntry) => {
    library.push(entry);
    saveLibrary();
};

const removeEntryFromLibrary = async (removedEntryId: number) => {
    library = library.filter((entry) => entry.manga.mangaId !== removedEntryId);
    saveLibrary();
}

const getLibrary = async () => {
    return library;
};

export { loadLibrary, addEntryToLibrary, removeEntryFromLibrary, getLibrary };