import { IconMoodEmpty, IconMoon, IconSearch } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";
import { useEffect, useState } from "react";
import { MangaDetails } from "../models/mangaDetails";
import { getLibrary, loadLibrary } from "../fileStorage/libraryStorage";
import { Link } from "react-router-dom";



const LibraryPage = () => {

    const [libraryData, setLibraryData] = useState<MangaDetails[]>([]);

    useEffect(() => {
        loadLibrary();
        const retrievedData = getLibrary();
        console.log(retrievedData)
        setLibraryData(retrievedData);
    }, []);

    return ( 
        <div className='h-screen bg-gray-100 px-5 w-full align-baseline'>
            <div className="w-full flex tems-stretch">
                <h1 className="text-3xl p-4 font-bold ">Library {libraryData.length}</h1>
                <div className="inline-flex m-1 *:my-3 *:mx-1 w-2/3">
                    
                    <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                    <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
                    <input className="font-semibold w-1/2   font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200 placeholder:text-black" placeholder="Search Library..."/>
                    
                </div>

                
                
            </div>
            
            {
                libraryData != null && libraryData.length > 0 ?
                
                <div className="grid xs:grids-col-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {
                        libraryData.map((manga) => (
                            <MangaCard 
                                    mangaId={manga.mangaId}
                                    title={manga.title}
                                    chapters={manga.totalChapters}
                                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
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