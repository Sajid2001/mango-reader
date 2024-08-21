import React, { useEffect, useMemo } from "react";
import { useRef, useState } from "react";
import {
  importLibraryFromFile,
  loadLibrary,
} from "../fileStorage/libraryStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  setChapterDownloadPath,
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
  const downloadSettings = useRef<HTMLAnchorElement>(null);
  const downloadLibrary = useRef<HTMLAnchorElement>(null);

  const getFile = (event: any) => {
    setFile(event.target.files[0]);
  };

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

  const chooseDirectory = async () => {
    const directory = await ipcRenderer.invoke("select-dirs");
    dispatch(setChapterDownloadPath(directory));
  };

  return (
    <div className="*:py-3 *:px-4 ml-4">
      <div className="w-[500px]">
        <h3 className="text-xl font-bold pb-2">Chapter Downloads</h3>
        <p className="text-sm font-normal">Custom Chapter Download Path</p>
        <div className="flex mt-1 gap-2 ">
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
            onClick={chooseDirectory}
            className=" bg-secondary font-semibold px-2 py-1 rounded-lg"
          >
            Choose Directory
          </button>
        </div>
      </div>

      <div className=" w-[500px]">
        <h3 className="text-xl font-bold pb-2">Library Backup</h3>

        <div className="flex *:font-semibold gap-2">
          <button
            onClick={() => downloadLibrary.current?.click()}
            className="disabled:opacity-50 bg-secondary py-1 rounded-lg w-full"
          >
            Export Library
          </button>
          <button
            onClick={() => importLibrary.current?.click()}
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
          <a
            ref={downloadLibrary}
            download="library.json"
            className="hidden"
            href="library.json"
          ></a>
        </div>
      </div>

      <div className=" w-[500px]">
        <h3 className="text-xl font-bold pb-2">Settings Backup</h3>

        <div className="flex *:font-semibold gap-2">
          <button
            onClick={() => downloadSettings.current?.click()}
            className="disabled:opacity-50 bg-secondary py-1 rounded-lg w-full"
          >
            Export Settings
          </button>
          <button
            onClick={() => importLibrary.current?.click()}
            className=" bg-secondary py-1 h-full rounded-lg w-full"
          >
            Import Settings
          </button>
          <input
            ref={importLibrary}
            onChange={getFile}
            type="file"
            id="file-input"
            className="hidden"
            accept=".json"
          ></input>
          <a
            ref={downloadSettings}
            download="settings.json"
            className="hidden"
            href="settings.json"
          ></a>
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
              key={option.value}
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
