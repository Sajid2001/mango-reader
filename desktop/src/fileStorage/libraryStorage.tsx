import { LibraryEntry } from "../models/libraryEntry";

import {
  readDataFromFile,
  replaceFileData,
  writeDataToFile,
} from "./dataManager";

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
};

const emptyLibrary = async () => {
  library = [];
  await saveLibrary();
};

const updateLibraryEntry = async (updatedEntry: LibraryEntry) => {
  const index = library.findIndex(
    (entry) => entry.manga.mangaId === updatedEntry.manga.mangaId
  );
  if (index !== -1) {
    library[index] = updatedEntry;
    await saveLibrary();
  } else {
    throw new Error(
      "Library Error: Tried to update entry not found in library"
    );
  }
};

const eraseAllHistoricalData = async () => {
  for (let i = 0; i < library.length; i++) {
    library[i].lastViewed = undefined;
    library[i].lastReadChapterName = undefined;
  }
  await saveLibrary();
};

const importLibraryFromFile = async (newLibraryFilepath: string) => {
  if (!isFileOfLibrary(readDataFromFile(newLibraryFilepath))) {
    throw new Error("File type not supported");
  }
  await replaceFileData(filepath, newLibraryFilepath).catch((err) => {
    //if failed here, it probably means the file couldnt be replaced
    throw new Error(err);
  });
};

function isFileOfLibrary(jsonData: any): jsonData is LibraryEntry[] {
  if (Array.isArray(jsonData) == false) return false;
  if (jsonData.length === 0) return true;
  let properFormat = true;
  for (let i = 0; i < jsonData.length; i++) {
    if (!isStructureOfLibraryEntry(jsonData[i])) {
      properFormat = false;
      break;
    }
  }
  return properFormat;
}

function isStructureOfLibraryEntry(jsonData: any): jsonData is LibraryEntry {
  return (
    typeof jsonData.progress === "number" &&
    typeof jsonData.manga.mangaId === "number" &&
    typeof jsonData.manga.title === "string" &&
    typeof jsonData.manga.totalChapters === "number" &&
    typeof jsonData.manga.coverImage === "string"
  );
}

// export { loadLibrary, addEntryToLibrary, removeEntryFromLibrary, emptyLibrary, getLibrary, updateLibraryEntry, eraseAllHistoricalData, importLibraryFromFile};
export {
  loadLibrary,
  addEntryToLibrary,
  removeEntryFromLibrary,
  emptyLibrary,
  updateLibraryEntry,
  eraseAllHistoricalData,
  importLibraryFromFile,
};
