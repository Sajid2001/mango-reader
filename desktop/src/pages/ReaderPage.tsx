import { current } from "@reduxjs/toolkit";
import { IconArrowAutofitHeight, IconArrowAutofitWidth, IconArrowBackUp, IconBook, IconChevronLeft,  IconChevronRight,  IconCircleArrowLeft,  IconCircleArrowRight,  IconKeyboard,  IconPageBreak,  IconSettings,  IconX } from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getLibrary, loadLibrary, updateLibraryEntry } from "../fileStorage/libraryStorage";
import { LibraryEntry } from "../models/libraryEntry";

const ReaderPage = () => {

    // [ VALUES ]
    
    //Fixed Values
    const IconSize = 28;

    //Params
    const { mangaId, chapterId } = useParams();

    //Navigation
    const navigate = useNavigate();

    //Primary Reader Values
    const [scans, setScans] = useState<string[]>([]);
    const [mangaName, setMangaName] = useState<string>("test");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [maxChapters, setMaxChapters] = useState<number>(0);
    const [chapterName, setChapterName] = useState<string>("test");
    const [loading, setLoading] = useState<boolean>(true);

    //Sidebar Option Values
    const [sidebarToggled, setSidebarToggled] = useState<boolean>(false);
    const [singlePage, setSinglePage] = useState<boolean>(false);
    const [fitHeight, setFitHeight] = useState<boolean>(true);
    const [leftToRight, setLeftToRight] = useState<boolean>(false);

    //References
    const scanRefs = useRef<(HTMLImageElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    //Library
    const [reading, setReading] = useState<LibraryEntry | null>(null);

    // [ FUNCTIONS ]

    //Use Effect for getting Manga Specifc Data
    useEffect(() => {

        // Checks if manga is already in library
        if(mangaId){
            loadLibrary().then(() => {
                getLibrary().then((library) => {
                    const previousReading = library.some((entry) => entry.manga.mangaId === Number(mangaId));
                    if (previousReading) {
                        setReading(() => {
                            const entry = library.find((entry) => entry.manga.mangaId === Number(mangaId));
                            if(entry) {
                                entry.progress = Number(chapterId);
                                entry.lastViewed = new Date();
                                updateLibraryEntry(entry);
                                return entry
                            }
                            else return null;
                        })
                    }
                })
                
            })
        }

        //Gets Manga Info such as name and total chapters
        fetch("http://127.0.0.1:8000/api/manga/"+Number(mangaId))
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
            }).then(data => {
                // Map fetched data to Post model
                setMangaName(data.title)
                setMaxChapters(data.total_chapters)
            })
            .catch(error => console.error('Error fetching chapter data:', error));
    
    }, [mangaId]);

    //Use Effect for getting Chapter Specifc Data
    useEffect(() => {
        let isCurrent = true;
        const getChapterData = async () => {
        
            setLoading(true);
            fetch("http://127.0.0.1:8000/api/chapters/"+Number(mangaId))
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    // Map fetched data to Post model
                    setChapterName(data[Number(chapterId)-1].chapter_name)
                })
                    .catch(error => console.error('Error fetching chapter data:', error));
            fetch("http://127.0.0.1:8000/api/chapters/"+Number(mangaId)+"/"+Number(chapterId))
                .then(response => {
                    if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
                }).then(data => {
                    // Map fetched data to Post model
                    const mappedData = data.map((chapter: any) => chapter.scan_url);
                    if(isCurrent){
                        setScans(mappedData);
                        setLoading(false);
                    } 
                })
                .catch(error => console.error('Error fetching chapter data:', error));
        }

        getChapterData();

        //If Chapter info is late loaded, then isCurrent is set to false and the data isnt used
        return () => {
            isCurrent = false;
            setCurrentPage(1);
        };
    }, [mangaId, chapterId]);

    //Key Press Listener
    const handleKeyPress = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'ArrowLeft':
            if (scans.length > 0) {
                previousPage();
            }
            break;
        case 'ArrowRight':
            if (scans.length > 0 && currentPage < scans.length) {
                nextPage();
            }
            break;
            default:
                break;
        }
    }

    //UseEffect for Adding/Updating Key Press Listener
    useEffect(() => {
        // Add event listener for keydown
        window.addEventListener('keydown', handleKeyPress); 

        // Cleans up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentPage, scans.length]);

    //Page Change Functions
    const nextPage = () => {
        setCurrentPage(currentPage => Math.min(currentPage + 1, scans.length));
        if(singlePage) window.scrollTo({ top: 0, behavior: 'instant' });
        else scanRefs.current[currentPage]?.scrollIntoView({ behavior: 'instant' });
    }

    const previousPage = () => {
        setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
        if(singlePage) window.scrollTo({ top: 0, behavior: 'instant' });
        else scanRefs.current[currentPage-2]?.scrollIntoView({ behavior: 'instant' }); 
    }

    //Chapter Change Functions
    const nextChapter = async () => {
        if(reading != null){
            const updatedReading = reading;
            updatedReading.progress = Math.min(reading.progress + 1, maxChapters);
            updatedReading.lastViewed = new Date();
            await updateLibraryEntry(updatedReading);
        }
        navigate(`/reader/${mangaId}/${Math.min(Number(chapterId)+1, maxChapters)}`)
    }

    const previousChapter = async () => {
        if(reading != null){
            const updatedReading = reading;
            updatedReading.progress = Math.max(reading.progress - 1, maxChapters);
            updatedReading.lastViewed = new Date();
            await updateLibraryEntry(updatedReading);
        }
        navigate(`/reader/${mangaId}/${Math.max(Number(chapterId)-1, 1)}`)
    }

    //UseEffect for Scrolling to Current Page if Longstrip is Turned On
    useEffect(() => {
        if(!singlePage) scanRefs.current[currentPage-1]?.scrollIntoView({ behavior: 'instant' });
    }, [singlePage])

    //UseEffect for Setting up Observer for Telling what Page the User is On when Longstring is Turned On
    //is technically also active when singlePage is on but its not needed since only one page is shown at a time
    useLayoutEffect(() => {
        scanRefs.current = scanRefs.current.slice(0, scans.length);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const visiblePageIndex = scanRefs.current.indexOf(entry.target as HTMLImageElement)+1;
                    setCurrentPage(visiblePageIndex);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0.5, 1.0],
            
        });
        
        scanRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            scanRefs.current.forEach((ref) => {
            if (ref) observer.unobserve(ref);
        });
        observer.disconnect();
        };
    }, [scans, singlePage])

    return ( 
        <div className="flex px-4 justify-center h-screen w-screen bg-gray-200 overflow-y-auto">
            {
                sidebarToggled ? 
                <div className=" fixed top-0 left-0 h-screen w-72 bg-gray-300 overflow-y-auto bg-opacity-65">
                    <div className="flex flex-col p-6 *:mb-3">
                        <div className="flex text-black font-bold text-2xl">
                            <button onClick={() => setSidebarToggled(false)}><IconX size={IconSize} color="black"/></button>
                            <p className="truncate">{mangaName}</p>
                        </div>
                        <div className="flex flex-col w-full font-semibold px-5 text-lg *:w-full *:flex *:px-2 *:py-1 *:items-center *:justify-between  *:bg-slate-100 *:rounded-lg *:my-2">
                            <div className="*:rounded-lg">
                                <button onClick={() => previousChapter()} className={`${Number(chapterId) <= 1 ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronLeft size={IconSize} color={`${Number(chapterId) <= 1 ? "inherit" : "black"}`}/></button>
                                    <p className="text-center">{chapterName}</p>
                                <button onClick={() => nextChapter()} className={`${Number(chapterId) >= maxChapters ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronRight size={IconSize} color={`${Number(chapterId) >= maxChapters ? "inherit" : "black"}`}/></button>
                            </div>
                            <div className="*:rounded-lg">
                                <button onClick={() => previousPage()} className={`${currentPage == 1 ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronLeft size={IconSize} color={`${currentPage <= 1 ? "inherit" : "black"}`}/></button>
                                {currentPage}/{scans.length}
                                <button onClick={() => nextPage()} className={`${currentPage >= scans.length ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronRight size={IconSize} color={`${currentPage >= scans.length ? "inherit" : "black"}`}/></button>
                                
                            </div>
                        </div>
                        <div className="flex flex-col w-full font-semibold px-5 text-lg  *:*::w-full *:*:flex *:px-2 *:py-1 *:*:items-center *:*:justify-between  *:bg-slate-100 *:rounded-lg *:my-2">
                            <button onClick={() => setSinglePage(!singlePage)} className="hover:bg-slate-200 active:bg-slate-400">{ singlePage ? <div>Longstrip <IconPageBreak size={IconSize}/></div> : <div>Single Page <IconBook size={IconSize}/></div>}</button>
                            <button onClick={() => setFitHeight(!fitHeight)} className="hover:bg-slate-200 active:bg-slate-400">{ fitHeight ?  <div>Fit Width <IconArrowAutofitWidth size={IconSize}/></div> : <div>Fit Height <IconArrowAutofitHeight size={IconSize}/></div>}</button>
                            {singlePage && <button onClick={() => setLeftToRight(!leftToRight)} className="hover:bg-slate-200 active:bg-slate-400">{ leftToRight ? <div>Right to Left <IconCircleArrowLeft size={IconSize}/></div> : <div>Left to Right <IconCircleArrowRight size={IconSize}/></div>}</button>}
                            <button className="hover:bg-slate-200 active:bg-slate-400"><div>Keybinds <IconKeyboard size={IconSize}/></div></button>
                            <button className="hover:bg-slate-200 active:bg-slate-400"><div>Settings <IconSettings size={IconSize}/></div></button>
                        </div>
                    </div>
                    
                </div>
                : 
                <button onClick={() => setSidebarToggled(true)} className="fixed top-10 left-14 p-3 bg-opacity-40 bg-slate-400 hover:bg-slate-600 hover:bg-opacity-40 text-white rounded-lg"><IconChevronLeft size={28} color="black"/></button>
            }
            {
                scans.length > 0 && !loading
                ?
                <div>
                    {
                        singlePage ? 
                        <img src={scans[currentPage-1]} className={`${fitHeight ? "h-full" : "w-full"} flex justify-self-center`}/> 
                        :
                        <div className="grid grid-cols-1" ref={containerRef}>
                            {
                                scans.map((scan: string, index: number) => 
                                    <img 
                                        key={index}
                                        src={scan} 
                                        ref={(el) => scanRefs.current[index] = el}
                                        id={`${index+1}`}  
                                        className={`${fitHeight ? "h-full" : "w-full"} flex justify-self-center`}
                                    />
                                )
                            }
                        </div>
                    }
                </div>
                :
                <div className="flex justify-center items-center w-full h-full">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-400 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                </div>
            }
            <Link to={`/manga/${mangaId}`} className="fixed top-10 right-14 text-3xl p-3 font-bold bg-slate-900 hover:bg-slate-600 text-white rounded-lg"><IconArrowBackUp size={28} color="white" /></Link>

        </div>
    );
}
 
export default ReaderPage;