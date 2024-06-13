import React, { useEffect, useMemo } from "react";
import { useRef, useState } from "react";
import { importLibraryFromFile, loadLibrary } from "../fileStorage/libraryStorage";


const SettingsPage = () => {

    useEffect(() => {
        loadLibrary()
    }, [])

    const [file, setFile] = useState<File | null>(null);    
    const importLibrary = useRef<HTMLInputElement>(null);
    
    
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
    

    return (  
        <div className="w-full flex-col">
            <div className="flex">
                <h1 className="text-3xl p-4 font-bold">Settings</h1>
                <button className="font-semibold text-lg px-4 m-5 text-white  bg-slate-900 rounded-lg active:bg-slate-700">Reset</button>
            </div>

                
            <div className="flex w-full border-b-4 ">
                <p className="text-2xl p-4 border-b-4 border-slate-600">General</p>
                <p className="text-2xl p-4 border-b-4 border-slate-300">Reader</p>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-bold">Update</h3>
                <ul className="ml-4 *:font-semibold ">
                    <li><input type="checkbox" className=" w-6 h-6 bg-slate-100 border-slate-100 rounded-full focus:ring-blue-500 focus:ring-2"/> Update Automatically</li>
                    <li><input type="checkbox" className=" w-6 h-6 bg-slate-100 border-slate-100 rounded-full focus:ring-blue-500 focus:ring-2" /> Refresh on startup</li>
                </ul>
            </div>

            <div className="p-4 ">
                <h3 className="ml-0 text-lg font-bold">Download Path</h3>
                <input type="text" placeholder="library filepath" className="bg-slate-200 rounded-lg p-1 px-2 my-2 ml-4 w-96" />
                <div className="ml-4">
                    <a className=" bg-slate-200 px-2 py-[5px] rounded-lg" href="./library.json" download>Export Library</a>
                    <button onClick={useFileImporter} className="ml-2 bg-slate-200 px-2 py-1 h-full rounded-lg">Import Library</button>
                    <input ref={importLibrary} onChange={getFile} type="file" id="file-input" className="hidden" accept=".json"></input>
                </div>
            </div> 

            <div className="p-4">
                <h3 className="text-lg font-bold">Appearance</h3>
                <select className="ml-4 p-1 bg-slate-200 *:bg-slate-100 rounded-lg">
                    <option value="mango">Mango</option>
                    <option value="peach">Peach</option>
                    <option value="honeydew">Honeydew</option>
                    <option value="starfruit">Starfruit</option>
                    <option value="plum">Plum</option>
                    <option value="coconut">Coconut</option>
                    <option value="grapefruit">Grapefruit</option>
                    <option value="avocado">Avocado</option>
                    <option value="licorice">Licorice</option>
                    <option value="ancientfruit">Ancientfruit</option>
                    <option value="devilfruit">Devilfruit</option>
                </select>
            </div>

            <div>
                
                

                

            </div>
            
            
            
        </div>
    );
}
 
export default SettingsPage;