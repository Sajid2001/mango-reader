import React, { useEffect, useMemo } from "react";
import { useRef, useState } from "react";
import { importLibraryFromFile, loadLibrary } from "../fileStorage/libraryStorage";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../reduxStorage/settingsSlice";

const GeneralSettings = () => {

    const dispatch = useDispatch();
    const theme = useSelector((state: any) => state.userSettings.theme)

    useEffect(() => {
        loadLibrary()
    }, [])

    const [file, setFile] = useState<File | null>(null);    
    const importLibrary = useRef<HTMLInputElement>(null);
    const exportLibrary = useRef<HTMLAnchorElement>(null);
    
    const useFileExporter = () => {
        exportLibrary.current?.click();
    }
    const useFileImporter = () => {
        importLibrary.current?.click();
    }

    const getFile = (event: any) => {
        setFile(event.target.files[0]);
    }

    useMemo( async () => {
        if(file !== undefined && file !== null){
            importLibraryFromFile(file.path)
        }
    }, [file])

    const changeTheme = (newTheme: string) => {
        dispatch(setTheme(newTheme));
    }

    return ( 
        <div className="*:py-3 *:px-4 ml-4">
            <div className="">
                <h3 className="text-xl font-bold pb-2">Chapter Downloads</h3>
                <p className="text-sm font-normal">Custom Chapter Download Path</p>
                <input type="text" placeholder="library filepath" className="bg-slate-200 rounded-lg p-1 px-2 my-1 w-96" />

            </div>

            <div className=" w-96">
                <h3 className="text-xl font-bold pb-2">Library Backup</h3>
                <p className="text-sm font-normal">Custom Backup Download Path</p>
                <input type="text" placeholder="library filepath" className="bg-slate-200 font-semibold rounded-lg p-1 px-2 mt-1 mb-2 w-full" />
                
                <div className="*:font-semibold">
                    <button onClick={useFileExporter} className=" bg-slate-200 px-2 py-1 rounded-lg w-[48%]" >Export Library</button>
                    <button onClick={useFileImporter} className="ml-2 w-[49%] bg-slate-200 px-2 py-1 h-full rounded-lg">Import Library</button>
                    <input ref={importLibrary} onChange={getFile} type="file" id="file-input" className="hidden" accept=".json"></input>
                    <a ref={exportLibrary} href="./library.json" className="hidden" download></a>
                </div>
            </div> 

            <div className="">
                <h3 className="text-xl font-bold pb-2">Theme</h3>
                <select onChange={(e) => changeTheme(e.target.value)} className="border-2 border-text p-1 bg-background  rounded-lg font-semibold">
                    <option className="default bg-background text-text" value="default">Default</option>
                    <option className="mango bg-background text-text" value="mango">Mango</option>
                    <option className="peach bg-background text-text" value="peach">Peach</option>
                    <option className="honeydew bg-background text-text" value="honeydew">Honeydew</option>
                    <option className="starfruit bg-background text-text" value="starfruit">Starfruit</option>
                    <option className="grape bg-background text-text" value="grape">Grape</option>
                    <option className="coconut bg-background text-text" value="coconut">Coconut</option>
                    <option className="cherry bg-background text-text" value="cherry">Cherry</option>
                    <option className="avocado bg-background text-text" value="avocado">Avocado</option>
                    <option className="licorice bg-background text-text" value="licorice">Licorice</option>
                    <option className="ancientFruit bg-background text-text" value="ancientFruit">Ancient Fruit</option>
                    <option className="devilFruit bg-background text-text" value="devilFruit">Devil Fruit</option>
                </select>
            </div>

        </div>
     );
}
 
export default GeneralSettings;