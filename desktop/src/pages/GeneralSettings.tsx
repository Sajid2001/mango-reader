import React, { useEffect, useMemo } from "react";
import { useRef, useState } from "react";
import {
  importLibraryFromFile,
  loadLibrary,
} from "../fileStorage/libraryStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  setChapterDownloadPath,
  setLibraryDownloadPath,
  setTheme,
} from "../reduxStorage/settingsSlice";
import themeOptions from "../themeOptions";

const GeneralSettings = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.userSettings.theme);

  useEffect(() => {
    loadLibrary();
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const importLibrary = useRef<HTMLInputElement>(null);

  const useFileImporter = () => {
    importLibrary.current?.click();
  };

  const getFile = (event: any) => {
    setFile(event.target.files[0]);
  };

  const libraryDownloadPath = useSelector(
    (state: any) => state.userSettings.libraryDownloadPath
  );

  const chapterDownloadPath = useSelector(
    (state: any) => state.userSettings.chapterDownloadPath
  );

  useMemo(async () => {
    if (file !== undefined && file !== null) {
      importLibraryFromFile(file.path);
    }
  }, [file]);

  const changeTheme = (newTheme: string) => {
    dispatch(setTheme(newTheme));
  };

  const { ipcRenderer } = window.require("electron");

  const downloadFile = (downloadDirectory: string, fileName: string) => {
    const path = window.require("path");

    if (!path) {
      alert("Please choose a download directory first!");
      return;
    }

    const fs = window.require("fs");

    const sourceFilePath = path.join(__dirname, fileName);
    const destFilePath = path.join(downloadDirectory);
    fs.copyFile(sourceFilePath, destFilePath, (err: any) => {
      if (err) {
        console.error("Error copying file:", err);
      } else {
        console.log("File copied successfully to", destFilePath);
        alert(`File downloaded to ${destFilePath}`);
      }
    });
  };

  const chooseDirectory = async (pathFor: string) => {
    const directory = await ipcRenderer.invoke("select-dirs");
    if (directory) {
      switch (pathFor) {
        case "libraryDownloadPath":
          dispatch(setLibraryDownloadPath(directory));
          break;
        case "chapterDownloadPath":
          dispatch(setChapterDownloadPath(directory));
          break;
        case "settingsDownloadPath":
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="*:py-3 *:px-4 ml-4">
      <div className="w-[500px]">
        <h3 className="text-xl font-bold pb-2">Chapter Downloads</h3>
        <p className="text-sm font-normal">Custom Chapter Download Path</p>
        <div className="flex mt-1 mb-2 gap-2 ">
          <div className="bg-secondary font-normal px-2 py-1 rounded-lg w-fit grow">
            {useMemo(() => {
              if (chapterDownloadPath === "") {
                return "No filepath selected";
              }
              const fullPath = chapterDownloadPath;
              const maxLength = 40;
              if (fullPath.length <= maxLength) {
                return fullPath;
              }

              const ellipsis = "...";
              const partLength = Math.floor((maxLength - ellipsis.length) / 2);

              const start = fullPath.substring(0, partLength);
              const end = fullPath.substring(fullPath.length - partLength);

              return `${start}${ellipsis}${end}`;
            }, [chapterDownloadPath])}
          </div>
          <button
            onClick={() => chooseDirectory("chapterDownloadPath")}
            className=" bg-secondary font-semibold px-2 py-1 rounded-lg"
          >
            Choose Directory
          </button>
        </div>
      </div>

      <div className=" w-[500px]">
        <h3 className="text-xl font-bold pb-2">Library Backup</h3>
        <p className="text-sm font-normal">Custom Backup Download Path</p>
        <div className="flex mt-1 mb-2 gap-2">
          <div className="bg-secondary font-normal px-2 py-1 rounded-lg w-fit grow">
            {useMemo(() => {
              if (libraryDownloadPath === "") {
                return "No filepath selected";
              }
              const fullPath = libraryDownloadPath;
              const maxLength = 40;
              if (fullPath.length <= maxLength) {
                return fullPath;
              }

              const ellipsis = "...";
              const partLength = Math.floor((maxLength - ellipsis.length) / 2);

              const start = fullPath.substring(0, partLength);
              const end = fullPath.substring(fullPath.length - partLength);

              return `${start}${ellipsis}${end}`;
            }, [libraryDownloadPath])}
          </div>
          <button
            onClick={() => chooseDirectory("libraryDownloadPath")}
            className=" bg-secondary font-semibold px-2 py-1 rounded-lg"
          >
            Choose Directory
          </button>
        </div>

        <div className="flex *:font-semibold gap-2">
          <button
            disabled={libraryDownloadPath === ""}
            onClick={() => downloadFile(libraryDownloadPath, "library.json")}
            className="disabled:opacity-50 bg-secondary py-1 rounded-lg w-full"
          >
            Export Library
          </button>
          <button
            onClick={useFileImporter}
            className=" bg-secondary py-1 h-full rounded-lg w-full"
          >
            Import Library
          </button>
          <input
            ref={importLibrary}
            onChange={getFile}
            type="file"
            id="file-input"
            className="hidden"
            accept=".json"
          ></input>
        </div>
      </div>

      <div className="">
        <h3 className="text-xl font-bold pb-2">Theme</h3>
        <select
          onChange={(e) => changeTheme(e.target.value)}
          value={theme}
          className="border-2 border-text p-1 bg-secondary  rounded-lg font-semibold"
        >
          {themeOptions.map((option) => (
            <option
              className={`${option.value} bg-background text-text`}
              value={option.value}
            >
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default GeneralSettings;
