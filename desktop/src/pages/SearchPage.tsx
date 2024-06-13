import { useEffect, useState } from "react";
import { MangaDetails } from "../models/mangaDetails";
import { IconMoon, IconSearch } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";

const SearchPage = () => {

    const [mangaData, setMangaData] = useState<MangaDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");

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
            .catch(error => console.error('Error fetching data:', error));
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
    <div className='h-screen bg-gray-100 px-5 w-full align-baseline overflow-y-auto'>
        <div className="w-full flex tems-stretch">
            <h1 className="text-3xl p-4 font-bold ">Search</h1>
            <div className="inline-flex m-1 *:my-3 *:mx-1 w-2/3 mb-7">

                <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24} /></button>
                <div className="w-full relative">
                    <input onChange={(e) => setSearchTerm(e.target.value)} className="font-semibold h-full text-lg px-5 pl-10 bg-slate-300 rounded-lg active:bg-slate-200 placeholder:text-black" placeholder="Search All..." />
                    <button onClick={() => SearchManga(searchTerm)} className="absolute inset-y-0 left-0 flex items-center pl-2"><IconSearch size={24}/></button>
                </div>

            </div>



        </div>

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
    </div>
);
}

export default SearchPage;