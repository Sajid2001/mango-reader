import { IconArrowDown, IconArrowUp, IconCheck, IconClock, IconDownload, IconMinus, IconPlayerPlay, IconPlus, IconSwitch, IconSwitchHorizontal } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
        coverImage: string;
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
        bannerImage: "https://media.kitsu.io/manga/38/cover_image/large-bd52b8f2fb81d3cf99b4fbe4c072d2b1.jpeg",
        coverImage: "https://media.kitsu.io/manga/38/cover_image/large-bd52b8f2fb81d3cf99b4fbe4c072d2b1.jpeg"
    });

    const [chapters, setChapters] = useState<ChapterDetails[]>([]);
    const [reading, setReading] = useState<LibraryEntry | null>();
    const [ascending, setAscending] = useState(true);
    const navigate = useNavigate();

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
                    alternateNames: data.alternate_names,
                    name: data.title,
                    genres: data.genres.split(", "),
                    description: data.description,
                    ongoing: true,
                    totalChapters: data.total_chapters,
                    bannerImage: data.banner_image,
                    coverImage: data.cover_image
                }
                //console.log(mappedData)
                setManga(mappedData);
            })
            .catch(error => console.error('Error fetching manga data:', error));

    }, []);



    useEffect(() => {
        if (manga.id != -1) {

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
                    setChapters(mappedData);

                })
                .catch(error => console.error('Error fetching chapter data:', error));
        }
        
    }, [manga])

    useEffect(() => {
        sortChapters();
    }, [chapters])

    const [isDescriptionOverflow, setIsDescriptionOverflow] = useState(false);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

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
        navigate(`/reader/${manga.id}/${chapters[0].chapterNumber}`);
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

    const sortChapters = () => {
        if (ascending) {
            setChapters(chapters.sort((a, b) => a.chapterNumber - b.chapterNumber));
        } else {
            setChapters(chapters.sort((a, b) => b.chapterNumber - a.chapterNumber));
        }
        setAscending(!ascending);
    }

    return (

        <div className="">
            <div>
                <div className="bg-slate-200 h-48 w-dull">
                    <img src={manga.bannerImage} alt="" className="h-full object-cover w-full" />
                </div>
                <div className="flex flex-col mt-2 max-h-screen">
                    <div className=" pl-4 pt-4 pr-2 pb-2 inline-block align-baseline">
                        <p className="text-3xl font-bold">{manga.name}<span className="pl-3 font-semibold text-sm">{manga.alternateNames}</span></p>
                    </div>
                    <div className="flex px-3">
                        {manga.genres != null ?
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
                        <p id="description" className={`font-semibold text-md overflow-hidden ${descriptionExpanded ? "h-auto" : "max-h-20"}`}>{manga.description}</p>

                    </div>
                    {isDescriptionOverflow &&
                        <button className="flex px-4 font-bold text-red-500 hover:text-red-800" onClick={toggleDescriptionExpansion}>{descriptionExpanded ? "See Less" : "See More"}</button>
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
                    <div className="grid grid-cols-1 gap-1 overflow-y-auto max-h-screen">

                        {chapters != null && chapters.length != 0 ?
                            <div className="">
                                {chapters.slice().reverse().map((chapter, index: number) => (
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