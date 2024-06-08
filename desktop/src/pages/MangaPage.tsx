import { IconArrowDown, IconArrowUp, IconCheck, IconChevronDown, IconChevronUp, IconClock, IconClockPause, IconDownload, IconMinus, IconPlayerPlay, IconPlus, IconSwitch, IconSwitchHorizontal, IconTrafficCone } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { addEntryToLibrary, getLibrary, loadLibrary, removeEntryFromLibrary } from "../fileStorage/libraryStorage";
import { MangaDetails } from "../models/mangaDetails";
import { LibraryEntry } from "../models/libraryEntry";
import { ChapterDetails } from "../models/chapterDetails";

const MangaPage = () => {

    // [ State Variables ]
    const [chapters, setChapters] = useState<ChapterDetails[]>([]);
    const [reading, setReading] = useState<LibraryEntry | null>();
    const [loadingManga, setLoadingManga] = useState<boolean>(true);
    const [loadingChapters, setLoadingChapters] = useState<boolean>(true);
    const [ascending, setAscending] = useState<boolean>(true);

    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Navigation
    const navigate = useNavigate();

    // Params
    const { id } = useParams();

    // Page Specific Interface
    interface MangaExtDetails {
        id: number;
        mangaka: string;
        alternateNames: string;
        name: string;
        genres: string[];
        description: string;
        publishStatus: string;
        scanStatus: string;
        totalChapters: number;
        bannerImage: string;
        coverImage: string;
    }

    // Manga State and Default Test Data
    const [manga, setManga] = useState<MangaExtDetails>({
        id: -1,
        mangaka: "Unknown Author",
        alternateNames: "",
        name: "No Manga Found",
        genres: [],
        description: "",
        publishStatus: "Unknown",
        scanStatus: "Unknown",
        totalChapters: 0,
        bannerImage: "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg",
        coverImage: "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg"
    });


    // [ Functions]

    // Gets Manga Data on Page Load
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/manga/" + id)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Map fetched data to Post model
                const mappedData: MangaExtDetails = {
                    id: data.id,
                    mangaka: data.authors,
                    alternateNames: data.alternateNames != null || data.alternateNames != "None" ? data.alternate_names : "l",
                    name: data.title,
                    genres: data.genres.split(", "),
                    description: data.description,
                    publishStatus: data.publish_status,
                    scanStatus: data.scan_status,
                    totalChapters: data.total_chapters,
                    bannerImage: data.banner_image,
                    coverImage: data.cover_image
                }
                //console.log(mappedData)
                setManga(mappedData);
            })
            .catch(error => console.error('Error fetching manga data:', error));

            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight,
                });
            };
        
            window.addEventListener('resize', handleResize);
        
            // Initial check
            checkOverflow();
            
            return () => {
                window.removeEventListener('resize', handleResize);
            };
    }, []);

    useEffect(() => {
        checkOverflow();
    }, [manga.description, windowSize]);


    //After Manga Data is Found, Gets Chapter Data and Checks Library
    useEffect(() => {
        if (manga.id != -1) {
            setLoadingChapters(true);
            loadLibrary().then(() => {
                getLibrary().then((library) => {
                    const previousReading = library.some((entry) => entry.manga.mangaId === manga.id);
                    if (previousReading) {
                        setReading(library.find((entry) => entry.manga.mangaId == manga.id)!);
                        
                    }
                })
            })
            

            fetch("http://127.0.0.1:8000/api/chapters/" + manga.id)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                }).then(data => {
                    // Map fetched data to Post model
                    const mappedData: ChapterDetails[] = data.map((post: any) => ({
                        mangaId: post.series_id,
                        chapterNumber: post.chapter_number,
                        chapterName: post.chapter_name
                    }))
                    if(ascending) setChapters(mappedData);
                    else setChapters(mappedData.reverse());
                    setLoadingChapters(false);
                })
                .catch(error => {
                    console.error('Error fetching chapter data:', error)
                    setLoadingChapters(false);
                });
                
        }
        
    }, [manga])

    const [isDescriptionOverflowing, setIsDescriptionOverflow] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);
    const [isChapterListAtTop, setIsChapterListAtTop] = useState(true);

    const toggleDescriptionExpansion = () => {
        setDescriptionExpanded(!descriptionExpanded);
    }

    const startSeries = async () => {
        if (reading != null) {
            console.log("Already reading");
            return;
        }
        const mangaDetails: MangaDetails = {
            mangaId: manga.id,
            title: manga.name,
            totalChapters: manga.totalChapters,
            coverImage: manga.coverImage
        }
        console.log(mangaDetails);
        const newEntry: LibraryEntry = {
            manga: mangaDetails,
            progress: 0
        }
        addEntryToLibrary(newEntry);
        setReading(newEntry);
    }

    const startReadingNow = () => {
        startSeries();
        navigate(`/reader/${manga.id}/1`);
    }

    const continueReading = () => {
        navigate(`/reader/${manga.id}/${reading!.progress}`);
    }

    const stopSeries = () => {
        console.log(reading);
        if (reading == null) {
            console.log("Already removed from library");
            return;
        }
        removeEntryFromLibrary(manga.id);
        setReading(null);
    }

    const sortChapters = async () => {
        if (ascending) {
            
            setChapters(() => {
                const sortedChapters = chapters.sort((a, b) => b.chapterNumber - a.chapterNumber)
                console.log(sortedChapters[0]);
                return sortedChapters
            });
            
        } else {
            setChapters(() => {
                const sortedChapters = chapters.sort((a, b) => a.chapterNumber - b.chapterNumber)
                console.log(sortedChapters[0]);
                return sortedChapters
            });
        }
        setAscending(!ascending);
    }

    const textRef = useRef(null);

    const checkOverflow = () => {
        const element: HTMLDivElement = textRef.current!;
        if (element) {
            const isOverflowing = element.scrollHeight > element.clientHeight || element.scrollHeight > element.offsetHeight;
            setIsDescriptionOverflow(isOverflowing);
        }
        
    };

    useEffect(() => {
        checkOverflow();

        // Add event listener for window resize
        window.addEventListener('resize', checkOverflow);

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [manga.description]);

    return (

        <div className="h-screen overflow-y-auto">

            <div className="bg-slate-200 h-48 w-dull">
                <img src={manga.bannerImage} alt="" className="h-full object-cover w-full" />
            </div>
            <div className="flex flex-col mt-2 max-h-screen">
                <div className=" pl-4 pt-4 pr-2 inline-block align-baseline">
                    <p className="text-3xl font-bold">{manga.name}<span className="pl-3 font-semibold text-sm">{manga.alternateNames}</span></p>
                </div>
                <div className="flex px-3 flex-wrap *:mt-2">
                    {manga.genres != null ?
                        manga.genres.map((genre) => (
                            <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md px-2">
                                {genre}
                            </div>
                        ))
                        :
                        <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                            No Associated Genres
                        </div>
                    }
                </div>

                <div className="flex *:px-4 py-2">
                    <p ref={textRef} className={`font-semibold text-md overflow-hidden ${descriptionExpanded ? "h-auto " : "max-h-20"} ${(isDescriptionOverflowing && !descriptionExpanded) && "bg-gradient-to-b from-black from-80% to-white to-98% inline-block text-transparent bg-clip-text"}`}>{manga.description}</p>

                </div>
                {(isDescriptionOverflowing || descriptionExpanded) &&
                    <button className="flex px-4 -translate-y-3 font-bold text-slate-500 hover:text-slate-800 items-center" onClick={toggleDescriptionExpansion}>{descriptionExpanded ? "See Less" : "See More"}{descriptionExpanded ? <IconChevronUp size={16}/> : <IconChevronDown size={16}/>}</button>
                }

                <div className="flex *:pl-4 font-semibold">
                    <p>{manga.mangaka}</p>
                    <div className="font-bold flex *:mr-2 flex-wrap">
                        <div className="flex">
                            { manga.scanStatus == "Ongoing" ? <IconClock />
                            : manga.scanStatus == "Completed" ? <IconCheck />
                            : manga.scanStatus == "Haitus" ? <IconClockPause />
                            : <IconTrafficCone/>   
                            }
                            <p className="pl-1">{manga.scanStatus} [Scan Status]</p>
                        </div>
                        <div className="flex">
                            { manga.publishStatus == "Ongoing" ? <IconClock />
                            : manga.publishStatus == "Completed" ? <IconCheck />
                            : manga.publishStatus == "Haitus" ? <IconClockPause />
                            : <IconTrafficCone/>   
                            }
                            <p className="pl-1">{manga.publishStatus} [Publishing Status]</p>
                        </div>
                    </div>
                </div>
                <div className="flex border-b-2 p-4 font-bold border-slate-800 justify-between">
                    <p>{manga.totalChapters == null || manga.totalChapters == 0 ? "No Chapters Available" : manga.totalChapters == 1 ? "1 Chapter" : `${manga.totalChapters} Chapters`}</p>
                    <div className="flex">
                        <div className="flex">
                            <button onClick={() => sortChapters()} className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700 items-center"> {ascending ? <IconArrowUp size={20}/> : <IconArrowDown size={20}/>}</button>
                            {
                                reading != null && reading.progress > 0?
                                <button onClick={continueReading} className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">  Continue <IconPlayerPlay className="pl-2" /></button>
                                :
                                <button onClick={startReadingNow} className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">  Start <IconPlayerPlay className="pl-2" /></button>
                            }
                            {
                                reading == null ?
                                <button onClick={startSeries} className="flex bg-black rounded-lg text-white py-1 px-3 hover:bg-slate-800 mr-4 justify-self-end active:bg-slate-700">  Add to Library <IconPlus className="pl-2" /></button>
                                :
                                <button onClick={stopSeries} className="flex bg-black rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:bg-slate-800 active:bg-slate-700">{}  Remove from Library <IconMinus className="pl-2" /></button>

                            }
                            <div className="flex">
                            </div>
                        </div>
                    
                    </div>

                </div>
                <div className="[scrollbarWidth:none] grid grid-cols-1 gap-1 overflow-y-auto max-h-screen">

                    {chapters != null && chapters.length != 0 ?
                        <div className="">
                            {chapters.map((chapter, index: number) => (
                                <Link to={`/reader/${manga.id}/${chapter.chapterNumber}`} className={`flex justify-between p-3 items-center ${reading && reading.progress >= chapter.chapterNumber ? index % 2 == 0 ? "bg-yellow-200 hover:bg-yellow-400" : " bg-yellow-300 hover:bg-yellow-500" : index % 2 == 0 ? "bg-slate-100 hover:bg-slate-300" : "bg-slate-200 hover:bg-slate-300"}`}>
                                    <div className="flex-col">
                                        <p className="font-semibold text-md">{chapter.chapterName}</p>
                                        <p>{chapter.chapterNumber}</p>
                                    </div>
                                    <div className="">
                                        <button className="bg-slate-500 rounded-lg text-white py-1 px-3 mr-4 hover:bg-slate-700 active:bg-slate-800"><IconDownload /></button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        :
                        <div className="flex justify-center items-center font-bold text-center mt-6">
                            {
                                loadingChapters ?
                                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-400 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>
                                :
                                <div className="flex-col">
                                    <p >Oops, could not find any chapters</p>
                                    <p className="">(╯°□°）╯ ┻━┻</p>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default MangaPage;