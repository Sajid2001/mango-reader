import { useEffect, useState } from "react";
import { MangaDetails } from "../models/mangaDetails";
import { IconMoon } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";

const SearchPage = () => {

    const [mangaData, setMangaData] = useState<MangaDetails[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/manga')
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
                title: post.name,
                totalChapters: post.totalChapters,
                
            }));
            setMangaData(mappedData);
          })
          .catch(error => console.error('Error fetching data:', error));
    }, []);

    return ( 
        <div className='h-screen bg-gray-100 px-5 w-full align-baseline'>
            <div className="w-full flex tems-stretch">
                <h1 className="text-3xl p-4 font-bold ">Search {mangaData.length}</h1>
                <div className="inline-flex m-1 *:my-3 *:mx-1 w-2/3">
                    
                    <button className="font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                    <button className="font-semibold px-3 bg-slate-300 rounded-lg  active:bg-slate-200"><IconMoon size={24}/></button>
                    <input className="font-semibold w-1/2   font-semibold text-lg px-5 bg-slate-300 rounded-lg active:bg-slate-200 placeholder:text-black" placeholder="Search All..."/>
                    
                </div>

                
                
            </div>
            
            <div className="grid xs:grids-col-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                
                {mangaData.map(item => (
                    <MangaCard 
                        mangaId={item.mangaId}
                        title={item.title}
                        image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                    />
                ))}
                <MangaCard 
                    title="Manga Title"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                
                
            </div>
        </div> 
    );
}
 
export default SearchPage;