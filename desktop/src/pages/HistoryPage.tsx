import { IconBook, IconMoon, IconPlayerPlayFilled, IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { eraseAllHistoricalData, getLibrary, loadLibrary, updateLibraryEntry } from "../fileStorage/libraryStorage";
import { LibraryEntry } from "../models/libraryEntry";
import { Link, useNavigate } from "react-router-dom";

const HistoryPage = () => {

    const [historicalData, setHistoricalData] = useState<LibraryEntry[]>([]);

    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const buttonIconSize = 48;
    let prevDate: Date | undefined = undefined;

    const navigate = useNavigate();

    useEffect(() => {
        loadLibrary().then(() => {
            getLibrary().then((data) => {
                setHistoricalData(() => {
                const filteredData = data.filter(x => x.lastViewed != undefined || x.lastViewed != null)
                return filteredData.sort((a, b) => new Date(b.lastViewed!).getTime() - new Date(a.lastViewed!).getTime())
            })});
        });
    }, []);

    const clearHistory = async () => {
        await eraseAllHistoricalData();
        setHistoricalData([]);
    };

    const removeFromHistory = (entry: LibraryEntry) => {
        entry.lastViewed = undefined;
        entry.lastReadChapterName = undefined;
        setHistoricalData(historicalData.filter(x => x.manga.mangaId !== entry.manga.mangaId));
        updateLibraryEntry(entry);

    }

    return (  
        <div className="h-screen bg-gray-100 px-5 w-full align-baseline overflow-y-auto">
            <div className="w-full flex flex-col">
                <div className=" flex flex-wrap *:pt-3 pb-4">
                    <h1 className="text-3xl pl-3 mr-2 font-bold ">Library</h1>
                    <div className="flex m-1 *:mr-2">
                        <button onClick={clearHistory} className="py-1  mb-3 font-semibold text-lg px-5 text-white bg-slate-900 rounded-lg active:bg-slate-700">Clear History</button>
                        <button className="py-1  mb-3 font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                        <button className="py-1 mb-3 font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
                    </div>

                    
                    
                </div>
                
                
                {
                    historicalData.length > 0 && historicalData.some((entry) => entry.lastViewed !== null || entry.lastViewed !== undefined) ? 
                    <div>
                        {
                            historicalData.map((entry, index ) => {
                                let header = null;
                                if (prevDate === undefined || new Date(entry.lastViewed!).toLocaleDateString() !== new Date(prevDate).toLocaleDateString()) {
                                    prevDate = entry.lastViewed;
                                    header = (
                                        <div>
                                            <p className="text-2xl p-2 my-6 border-b-4 border-slate-300 font-semibold">{months[new Date(entry.lastViewed!).getMonth()]} {new Date(entry.lastViewed!).getDate()} {new Date(entry.lastViewed!).getFullYear()}</p>
                                        </div>
                                        
                                    );
                                }
                                const history = (
                                    <div className="flex my-4 justify-between" key={index}> 
                                        <div className="flex items-center">
                                            <img src={entry.manga.coverImage} className=" aspect-[2/3] rounded-2xl object-fit w-40" alt="" />
                                            <div className="flex flex-col">
                                                <p className="text-2xl px-4 border-slate-300 font-bold">{entry.manga.title}</p>
                                                <p className="text-2xl px-4 border-slate-300">{entry.lastReadChapterName}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center mx-1 md:mx-8 ">
                                            <button onClick={() => navigate(`/reader/${entry.manga.mangaId}/${entry.progress}`)} className="text-center items-center  text-2xl flex font-semibold m-8 py-1 px-2  rounded-lg hover:bg-slate-300 active:bg-slate-400 "><IconPlayerPlayFilled className="" size={buttonIconSize}/></button>

                                            <button onClick={() => removeFromHistory(entry)} className="font-semibold  py-1 px-2  hover:bg-slate-300 rounded-lg  active:bg-slate-400 "><IconTrash size={buttonIconSize}/></button>

                                        </div>
                                    </div>
                                )
                                return (
                                    header ?
                                    [
                                        header,
                                        history
                                    ]:
                                    history
                                );
                                
                            })
                        }
                    </div>
                    :
                    <div className="grid  font-bold text-center mt-6 place-content-center m-4">
                        <div className="flex-col text-center bg-slate-400 rounded-lg p-4">
                            <p className="text-xl justify-self-center">This page is for keeping track of your reading progress for manga in your library. You dont have any reading history right now.</p>
                            
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