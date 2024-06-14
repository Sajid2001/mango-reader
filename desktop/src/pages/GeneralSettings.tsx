import React, { useEffect, useMemo } from "react";
import { useRef, useState } from "react";
import { importLibraryFromFile, loadLibrary } from "../fileStorage/libraryStorage";

const GeneralSettings = () => {

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
                <select className="p-1 bg-slate-200 *:bg-slate-100 rounded-lg font-semibold">
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

        </div>
     );
}
 
export default GeneralSettings;