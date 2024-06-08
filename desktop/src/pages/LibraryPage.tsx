import { IconMoodEmpty, IconMoon, IconSearch } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";
import { useEffect, useState } from "react";
import { MangaDetails } from "../models/mangaDetails";
import { getLibrary, loadLibrary, emptyLibrary } from "../fileStorage/libraryStorage";
import { Link } from "react-router-dom";
import { LibraryEntry } from "../models/libraryEntry";
import { get } from "node:http";



const LibraryPage = () => {

    // [ State Variables ]

    const [libraryData, setLibraryData] = useState<LibraryEntry[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterTerm, setFilterTerm] = useState<string>("");

    
    // [ Functions ]

    //Gets User Library Data on Library Page load
    useEffect(() => {
        loadLibrary().then(() => {
            getLibrary().then((data) => setLibraryData(data));
        });
    }, []);

    //Enter Key Press Listener
    const handleEnterSearch = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            setFilterTerm(() =>(searchTerm));
        }
    };

    //UseEffect for Adding/Updating Enter Key Press Listener
    useEffect(() => {
        // Add event listener for keydown
        window.addEventListener('keydown', handleEnterSearch); 

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleEnterSearch); 
        };
    }, [searchTerm]);

    //Erase User Library Data Function
    const clearLibrary = () => {
        emptyLibrary();
        setLibraryData([]);
    }

    return ( 
        <div className='h-screen flex-col bg-gray-100 px-5 w-full align-baseline overflow-y-auto'>
            <div className=" flex flex-wrap *:pt-3 pb-4">
                <h1 className="text-3xl  pl-3 font-bold">Library</h1>
                <div className="flex m-1 *:mb-3 *:mx-1 *:py-1">
                    <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                    <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
                    <div className="flex relative max-w-30 ">
                        <input onChange={(e) => setSearchTerm(e.target.value)} className="grow font-semibold h-full text-lg px-5 pl-10 bg-slate-300 rounded-lg active:bg-slate-200 placeholder:text-black" placeholder="Search Library..." />
                        <button onClick={() => setFilterTerm(searchTerm)} className="absolute inset-y-0 left-0 flex items-center pl-2"><IconSearch size={24}/></button>
                    </div>
                
                    <button onClick={clearLibrary} className="font-semibold text-lg px-5 bg-red-300 rounded-lg hover:bg-red-400 active:bg-red-600 justify-self-end">Clear Library</button>
                    
                    
                </div>

                
                
            </div>
            
            {
                libraryData != null  && libraryData.length > 0?
                
                <div className="grid xs:grids-col-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {
                        libraryData.filter((entry) => entry.manga.title.toLowerCase().includes(filterTerm)).map((entry: LibraryEntry) => (
                            <MangaCard 
                                key={entry.manga.mangaId} 
                                mangaId={entry.manga.mangaId}
                                title={entry.manga.title}
                                chapters={entry.manga.totalChapters}
                                image={entry.manga.coverImage}
                            />
                        ))
                    }
                </div>
                
                :
                <div className="grid  font-bold text-center mt-6 place-content-center m-4">
                    <div className="flex-col text-center bg-slate-400 rounded-lg p-4">
                        <p className="text-xl justify-self-center">You dont have any manga in your library </p>
                        
                        <div className="flex m-1 mt-4 justify-center">
                            <Link to="/search" ><button className="flex font-semibold text-lg px-5 bg-slate-300 rounded-lg hover:bg-slate-200 p-1">Go Find Some <IconSearch className="ml-1 my-1" size={24}/></button></Link>
                        </div>
                    </div>
                </div>
            }
            
        </div> 
    );
}
 
export default LibraryPage;