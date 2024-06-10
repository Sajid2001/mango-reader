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
    await saveLibrary();
};

const removeEntryFromLibrary = async (removedEntryId: number) => {
    library = library.filter((entry) => entry.manga.mangaId != removedEntryId);
    await saveLibrary();
}

const emptyLibrary = async () => {
    library = [];
    await saveLibrary();
}

const updateLibraryEntry = async (updatedEntry: LibraryEntry) => {
    const index = library.findIndex((entry) => entry.manga.mangaId === updatedEntry.manga.mangaId);
    if(index !== -1) {
        library[index] = updatedEntry;
        await saveLibrary();
    }
    else{
        throw new Error('Library Error: Tried to update entry not found in library');
    }
    
}

const eraseAllHistoricalData = async () => {
    for(let i = 0; i < library.length; i++) {
       library[i].lastViewed = undefined; 
       library[i].lastReadChapterName = undefined; 
    }
    await saveLibrary();
}

const getLibrary = async () => {
    return library;
};

export { loadLibrary, addEntryToLibrary, removeEntryFromLibrary, emptyLibrary, getLibrary, updateLibraryEntry, eraseAllHistoricalData};