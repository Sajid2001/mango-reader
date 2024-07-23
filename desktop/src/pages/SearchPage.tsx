import { useEffect, useState } from "react";
import { MangaDetails } from "../models/mangaDetails";
import { IconMoon, IconSearch } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";

const SearchPage = () => {

    const [mangaData, setMangaData] = useState<MangaDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

    const refreshPage = () => {
        setIsRefreshing(true);
        window.location.reload();
    }

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/manga/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Map fetched data to Post model
                const mappedData: MangaDetails[] = data.map((post: any) => ({
                    mangaId: post.id,
                    title: post.title,
                    totalChapters: post.total_chapters,
                    coverImage: post.cover_image

                }));
                setMangaData(mappedData);
            })
            .catch(error => console.error('Error fetching data:', error))
            .finally(() => 
                {
                    setIsRefreshing(false);
                    setLoading(false);
                }
            );
    }, []);

    const SearchManga = (term: string) => {
        let link = (term == '') ? `http://127.0.0.1:8000/api/manga/` : `http://127.0.0.1:8000/api/manga/search?name=${term}`; 
        fetch(link)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                const mappedData: MangaDetails[] = data.map((post: any) => ({
                    mangaId: post.id,
                    title: post.title,
                    totalChapters: post.total_chapters,
                    coverImage: post.cover_image
                }));
                if(mangaData != mappedData) setMangaData(mappedData);
                
            })
    }

    const handleEnterSearch = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            setSearchTerm(() => {
                SearchManga(searchTerm);
                return '';
            });
        }
    };

    useEffect(() => {
        // Add event listener for keydown
        window.addEventListener('keydown', handleEnterSearch); 

        // Clean up event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleEnterSearch); 
        };
    }, [searchTerm]);



return (
    <div className='h-screen px-5 w-full align-baseline overflow-y-auto'>

        <div className=" flex flex-wrap *:pt-3 pb-4">
            <h1 className="text-3xl pl-3 mr-2 font-bold ">Search</h1>
            <div className="flex m-1 *:mr-2">
                <button className="py-1  mb-3 font-semibold text-lg px-5 bg-secondary rounded-lg active:bg-slate-200">Layout</button>
                <button className="py-1 mb-3 font-semibold px-3 bg-secondary rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
                <div className="flex relative max-w-30">
                    <input onChange={(e) => setSearchTerm(e.target.value)} className="py-1 mb-3 grow font-semibold text-lg px-5 pl-10 bg-secondary rounded-lg active:bg-slate-200 placeholder:text-text" placeholder="Search Library..." />
                    <button onClick={() => SearchManga(searchTerm)} className="py-1 mb-3 absolute inset-y-0 left-0 flex items-center pl-2"><IconSearch size={24}/></button>
                </div>                    
                
            </div>

            
            
        </div>

        
        {
        
            loading ?
            <div className="flex justify-center items-center w-full h-full">
                <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-400 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
            
            :
            (mangaData != null && mangaData.length != 0) ?
            <div className="grid xs:grids-col-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {mangaData.map(item => (
                    <MangaCard
                        mangaId={item.mangaId}
                        title={item.title}
                        image={item.coverImage}
                        chapters={item.totalChapters}
                    />
                ))}
            </div>
            :

            <div className="grid  font-bold text-center mt-6 place-content-center m-4">
                <div className="flex-col text-center bg-slate-400 rounded-lg p-4  justify-content-center">
                    <p className="text-xl mb-2">Sorry! We cant seem to find anything right now</p>
                    <div className="flex justify-center">
                        <button onClick={refreshPage} className="flex font-semibold text-lg px-5 bg-slate-300 rounded-lg hover:bg-slate-200 active:bg-slate-500 p-1 m-1 justify-center" >
                            {
                                !isRefreshing ?
                                <p>Refresh</p>
                                :

                                <svg aria-hidden="true" className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-400 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg>

                            }
                        </button>
                    </div>
                    
                </div>
            </div>
        }
        
        
    </div>
);
}

export default SearchPage;