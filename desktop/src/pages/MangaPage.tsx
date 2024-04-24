import { IconCheck, IconClock, IconDownload, IconMinus, IconPlayerPlay, IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { addEntryToLibrary, getLibrary, loadLibrary, removeEntryFromLibrary } from "../fileStorage/libraryStorage";
import { MangaDetails } from "../models/mangaDetails";
import { LibraryEntry } from "../models/libraryEntry";
import { ChapterDetails } from "../models/chapterDetails";

const MangaPage = () => {

    
    
    interface MangaExtDetails {
        id: number;
        mangaka: string;
        alternateNames: string;
        name: string;
        genres: string[];
        description: string;
        ongoing: boolean;
        totalChapters: number;
        bannerImage: string;
    }

    const { id } = useParams();

    const [manga, setManga] = useState<MangaExtDetails>({
        id: -1,
        mangaka: "Akira Toriyama",
        alternateNames: "Duragon no Hoshi",
        name: "Dragon Ball Z",
        genres: ["Action", "Adventure", "Hispanic"],
        description: "",
        ongoing: true,
        totalChapters: 100,
        bannerImage: "https://media.kitsu.io/manga/38/cover_image/large-bd52b8f2fb81d3cf99b4fbe4c072d2b1.jpeg"
    });

    const [chapters, setChapters] = useState<ChapterDetails[]>([]);
    const [reading, setReading] = useState<LibraryEntry | null>();

    useEffect(() => {
        fetch("http://localhost:3001/manga?id="+id)
            .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // Map fetched data to Post model
            const mappedData: MangaExtDetails = {
                id: data[0].id,
                mangaka: data[0]['author(s)'],
                alternateNames: data[0].alternateNames,
                name: data[0].name,
                genres: data[0].genres.split(", "),
                description: data[0].description,
                ongoing: true,
                totalChapters: data[0].totalChapters,
                bannerImage: data[0].bannerImage
            }
            //console.log(mappedData)
            setManga(mappedData);
          })
          .catch(error => console.error('Error fetching manga data:', error));
          
    }, []);

   

    useEffect(() => {
        if(manga.id != -1){

            loadLibrary().then(() => {
                getLibrary().then((library) => {
                    console.log(manga.id);
                    const previousReading = library.some((entry) => entry.manga.mangaId === id);
                    console.log(previousReading);
                    if (previousReading) {
                        setReading(library.find((entry) => entry.manga.mangaId == manga.id)!);
                    }
                })
            })

            fetch("http://localhost:3001/chapters?series_id="+manga.id)
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    // Map fetched data to Post model
                    const mappedData: ChapterDetails[] = data.map((post: any) => ({
                        mangaId: post.series_id,
                        chapterNumber: post.number
                    }))
                    setChapters(mappedData);
                    
                })
                .catch(error => console.error('Error fetching chapter data:', error));
        }
    }, [manga])

    const [isDescriptionOverflow, setIsDescriptionOverflow] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    
    const toggleDescriptionExpansion = () => {
        setDescriptionExpanded(!descriptionExpanded);
    }

    const startSeries = () => {
        if(reading != null){
            console.log("Already reading");
            return;
        }
        const mangaDetails: MangaDetails = {
            mangaId: manga.id,
            title: manga.name,
            totalChapters: manga.totalChapters,
            image: manga.bannerImage
        }
        const newEntry: LibraryEntry = {
            manga: mangaDetails,
            progress: 0
        }
        addEntryToLibrary(newEntry);
        setReading(newEntry);
    }

    const stopSeries = () => {
        console.log(reading);
        if(reading == null){
            console.log("Already removed from library");
            return;
        }
        removeEntryFromLibrary(manga.id);
        setReading(null);
    }


    return ( 

        
        
        <div>
            <div>
                <div className="bg-slate-200 h-48 w-dull">
                    <img src={manga.bannerImage} alt="" className="h-full object-cover w-full"/>
                </div>
                <div className="flex flex-col mt-2">
                    <div className=" pl-4 pt-4 pr-2 pb-2 inline-block align-baseline">
                        <p className="text-3xl font-bold">{manga.name}<span className="pl-3 font-semibold text-sm">{manga.alternateNames}</span></p>
                    </div>
                    <div className="flex px-3">
                        { manga.genres != null ?
                            manga.genres.map((genre) => (
                                <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                                    {genre}
                                </div>
                            ))
                            :
                            <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                                No Associated Genres
                            </div>
                        }
                    </div>
                    
                    <div className="flex *:px-4 *:py-2">
                        <p  id="description" className={`font-semibold text-md overflow-hidden ${descriptionExpanded ? "h-auto" : "max-h-20"}` }>{manga.description}</p>
                        
                    </div>
                    { isDescriptionOverflow &&
                        <button className="flex px-4 font-bold text-red-500 hover:text-red-800" onClick={toggleDescriptionExpansion}>{ descriptionExpanded ? "See Less" : "See More"}</button>
                    }

                    <div className="flex *:px-4 font-semibold">
                        <p>{manga.mangaka}</p>
                        <div className="font-bold">{manga.ongoing ? 
                            <div className="flex">
                                <IconClock /> 
                                <p className="pl-1">Ongoing</p>
                            </div>  
                            : 
                            <div className="flex">
                                <IconCheck /> 
                                <p className="pl-1">Completed</p>
                            </div>  
                            }
                        </div>
                    </div>
                    <div className="flex border-b-2 p-4 font-bold border-slate-800 justify-between">
                        <p>{manga.totalChapters == null || manga.totalChapters == 0 ? "No Chapters Available" : manga.totalChapters == 1 ? "1 Chapter" : `${manga.totalChapters} Chapters`}</p>
                            {
                                reading == null ?
                                <div className="flex">
                                    <button className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">  Start <IconPlayerPlay className="pl-2"/></button>
                                    <button onClick={startSeries} className="flex bg-black rounded-lg text-white py-1 px-3 hover:bg-slate-800 mr-4 justify-self-end active:bg-slate-700">  Add to Library <IconPlus className="pl-2"/></button>
                                </div>
                                :
                                <div className="flex">
                                    <button className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">  Continue <IconPlayerPlay className="pl-2"/></button>
                                    <button onClick={stopSeries} className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">  Remove from Library <IconMinus className="pl-2"/></button>
                                </div>
                            }
                        
                        </div>
                    <div className="grid grid-cols-1 gap-1">
                        
                        {   chapters != null && chapters.length != 0?
                            <div>
                                {chapters.map((chapter) => (
                                <div className="flex justify-between p-3 items-center">
                                    <div className="flex-col">
                                        <p className="font-semibold text-md">Chapter {chapter.chapterNumber}</p>
                                        <p>04/20/2024</p>
                                    </div>
                                    <div className="">
                                        <button className="bg-slate-500 rounded-lg text-white py-1 px-3 mr-4 hover:bg-slate-700 active:bg-slate-800"><IconDownload /></button>
                                    </div>

                                </div>
                                ))}
                            </div>
                            :
                            <div className="flex justify-center font-bold text-center mt-6">
                                <div className="flex-col">
                                    <p >Oops, could not find any chapters</p>
                                    <p className="">(╯°□°）╯ ┻━┻</p>
                                </div>
                            </div>
                        }
                            
                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </div>
     );
}
 
export default MangaPage;