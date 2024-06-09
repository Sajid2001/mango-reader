import { IconBook, IconMoon } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { eraseAllHistoricalData, getLibrary, loadLibrary } from "../fileStorage/libraryStorage";
import { LibraryEntry } from "../models/libraryEntry";
import { Link } from "react-router-dom";

const HistoryPage = () => {

    const [historicalData, setHistoricalData] = useState<LibraryEntry[]>([]);

    useEffect(() => {
        loadLibrary().then(() => {
            getLibrary().then((data) => setHistoricalData(data.filter(x => x.lastViewed !== undefined && x.lastViewed !== null).sort((a, b) => b.lastViewed!.getTime() - a.lastViewed!.getTime())));
        });
    }, []);

    const clearHistory = async () => {
        await eraseAllHistoricalData();
        setHistoricalData([]);
    };

    return (  
        <div className="h-screen bg-gray-100 px-5 w-full align-baseline overflow-y-auto">
            <div className="w-full flex flex-col">
                <div className="w-full flex tems-stretch">
                    <h1 className="text-3xl p-4 font-bold ">History</h1>
                    <div className="inline-flex m-1 *:my-3 *:mx-1 w-2/3">
                        <button className="font-semibold text-lg px-5 text-white bg-slate-900 rounded-lg active:bg-slate-700">Clear History</button>
                        <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                        <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24} /></button>

                    </div>

                

                </div>
                {
                    historicalData.length > 0 && historicalData.some((entry) => entry.lastViewed !== null || entry.lastViewed !== undefined) ? 
                    <div>
                        {
                            historicalData.map((entry) => (
                                <div>
                                    <p>{entry.manga.title}</p>
                                </div>
                            ))
                        }
                    </div>
                    :
                    <div className="grid  font-bold text-center mt-6 place-content-center m-4">
                        <div className="flex-col text-center bg-slate-400 rounded-lg p-4">
                            <p className="text-xl justify-self-center">This page is for keeping track of your reading progress for manga in your library. You dont have any reading history right now</p>
                            
                            <div className="flex m-1 mt-4 justify-center">
                                <Link to="/" ><button className="flex font-semibold text-lg px-5 bg-slate-300 rounded-lg hover:bg-slate-200 p-1">Go Read Some Manga <IconBook className="ml-1 my-1" size={24}/></button></Link>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
 
export default HistoryPage;