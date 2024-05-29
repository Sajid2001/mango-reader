import { IconArrowBackUp, IconArrowsMaximize, IconArrowsMinimize, IconBook, IconChevronLeft,  IconChevronRight,  IconCircleArrowLeft,  IconCircleArrowRight,  IconKeyboard,  IconPageBreak,  IconSettings,  IconX } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

const ReaderPage = () => {
    const IconSize = 28;
    const { mangaId, chapterId } = useParams();
    const [scans, setScans] = useState<string[]>();

    const [sidebarToggled, setSidebarToggled] = useState(false);
    const [mangaName, setMangaName] = useState<string>("test");
    const [curentPage, setCurrentPage] = useState<number>(0);
    const [maxChapters, setMaxChapters] = useState<number>(0);
    const [chapterName, setChapterName] = useState<string>("test");

    const [singlePage, setSinglePage] = useState<boolean>(false);
    const [fitHeight, setFitHeight] = useState<boolean>(false);
    const [leftToRight, setLeftToRight] = useState<boolean>(false);

    const imageRefs = useRef([]);

    useEffect(() => {
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

    useEffect(() => {
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
                
                setScans(mappedData);
            })
            .catch(error => console.error('Error fetching chapter data:', error));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setCurrentPage(Number(entry.target.id));
                }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.5,
            }
            );
        
            imageRefs.current.forEach((image: any) => {
                if (image) observer.observe(image);
            });
        
            return () => {
            imageRefs.current.forEach((image: any) => {
                if (image) observer.unobserve(image);
            });
        };
    }, [mangaId, chapterId]);

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
                                <Link to={`/reader/${mangaId}/${Math.max(Number(chapterId)-1, 1)}`} className={`${Number(chapterId) == 0 ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronLeft size={IconSize} color={`${Number(chapterId) != 0 ? "black" : "inherit"}`}/></Link>
                                    <p className="text-center">{chapterName}</p>
                                <Link to={`/reader/${mangaId}/${Math.min(Number(chapterId)+1, maxChapters)}`}  className={`${Number(chapterId) == maxChapters ? "pointer-events-none" : "hover:bg-slate-200 active:bg-slate-400"}`}><IconChevronRight size={IconSize} color={`${Number(chapterId) != maxChapters ? "black" : "inherit"}`}/></Link>
                            </div>
                            <div className="*:rounded-lg">
                                <button onClick={() => ""} className="hover:bg-slate-200 active:bg-slate-400"><IconChevronLeft size={IconSize}/></button>
                                1/{scans?.length}
                                <button className="hover:bg-slate-200 active:bg-slate-400"><IconChevronRight size={IconSize}/></button>
                            </div>
                        </div>
                        <div className="flex flex-col w-full font-semibold px-5 text-lg  *:*::w-full *:*:flex *:px-2 *:py-1 *:*:items-center *:*:justify-between  *:bg-slate-100 *:rounded-lg *:my-2">
                            <button onClick={() => setSinglePage(!singlePage)} className="hover:bg-slate-200 active:bg-slate-400">{ singlePage ? <div>Longstrip <IconPageBreak size={IconSize}/></div> : <div>Single Page <IconBook size={IconSize}/></div>}</button>
                            <button onClick={() => setFitHeight(!fitHeight)} className="hover:bg-slate-200 active:bg-slate-400">{ fitHeight ?  <div>Fit Width <IconArrowsMinimize size={IconSize}/></div> : <div>Fit Height <IconArrowsMaximize size={IconSize}/></div>}</button>
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
                scans != null
                ?
                <div className="grid grid-cols-1">
                    {
                        scans.map((scan: string, index: number) => <img src={scan} id={`${index}`}  className="flex justify-self-center"/>)
                    }
                </div>
                :
                <div>
                    <p>Loading...</p>
                </div>
            }
            <Link to={`/manga/${mangaId}`} className="fixed top-10 right-14 text-3xl p-3 font-bold bg-slate-900 hover:bg-slate-600 text-white rounded-lg"><IconArrowBackUp size={28} color="white" /></Link>

        </div>
    );
}
 
export default ReaderPage;