import { IconArrowBackUp, IconArrowsMaximize, IconBook, IconChevronLeft,  IconChevronRight,  IconCircleArrowRight,  IconKeyboard,  IconSettings,  IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
                    setChapterName(data[Number(chapterId)].chapter_name)
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
                                <Link to={`/reader/${mangaId}/${Math.max(Number(chapterId)-1, 1)}`} className="hover:bg-slate-200 active:bg-slate-400"><IconChevronLeft size={IconSize}/></Link>
                                {chapterName}
                                <Link to={`/reader/${mangaId}/${Math.min(Number(chapterId)+1, maxChapters)}`}  className="hover:bg-slate-200 active:bg-slate-400 disabled:bg-green-500"><IconChevronRight size={IconSize}/></Link>
                            </div>
                            <div className="*:rounded-lg">
                                <button className="hover:bg-slate-200 active:bg-slate-400"><IconChevronLeft size={IconSize}/></button>
                                1/{scans?.length}
                                <button className="hover:bg-slate-200 active:bg-slate-400"><IconChevronRight size={IconSize}/></button>
                            </div>
                        </div>
                        <div className="flex flex-col w-full font-semibold px-5 text-lg *:w-full *:flex *:px-2 *:py-1 *:items-center *:justify-between  *:bg-slate-100 *:rounded-lg *:my-2">
                            <button className="hover:bg-slate-200 active:bg-slate-400">Single Page <IconBook size={IconSize}/></button>
                            <button className="hover:bg-slate-200 active:bg-slate-400">Fit Height <IconArrowsMaximize size={IconSize}/></button>
                            <button className="hover:bg-slate-200 active:bg-slate-400">Left To Right <IconCircleArrowRight size={IconSize}/></button>
                            <button className="hover:bg-slate-200 active:bg-slate-400">Keybinds <IconKeyboard size={IconSize}/></button>
                            <button className="hover:bg-slate-200 active:bg-slate-400">Settings <IconSettings size={IconSize}/></button>
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
                        scans.map((scan: string, index: number) => <img src={scan} id={`scan-${index}`}  className="flex justify-self-center"/>)
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