import { IconMoon } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";
import { useEffect, useState } from "react";
import axios from 'axios';
import { MangaDetails } from "../models/mangaDetails";


const LibraryPage = () => {

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
                title: post.Name,
                totalChapters: post["Total Chapters"],
                
            }));
            setMangaData(mappedData);
          })
          .catch(error => console.error('Error fetching data:', error));
    }, []);

    return ( 
        <div className='h-screen bg-gray-100 px-5 w-full align-baseline'>
            <div className="w-full flex tems-stretch">
                <h1 className="text-3xl p-4 font-bold ">Library {mangaData.length}</h1>
                <button className="font-semibold text-lg px-3 m-4  bg-slate-300 rounded-lg active:bg-slate-200">Layout</button>
                <button className="font-semibold h-8 px-3 m-3 self-center bg-slate-300 rounded-lg active:bg-slate-200"><IconMoon size={20}/></button>
                <input className="font-semibold w-1/3 h-8  mx-2 p-3 py-5 self-center text-lg rounded-lg align-middle bg-slate-300 placeholder:text-black" placeholder="Search Library..."/>
                
                
            </div>
            
            <div className="grid xs:grids-col-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                
                {mangaData.map(item => (
                    <MangaCard 
                        title={item.title}
                        chapters={item.totalChapters}
                        image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                    />
                ))}
                <MangaCard 
                    title="Manga Title"
                    chapters={10}
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                
                
            </div>
        </div> 
    );
}
 
export default LibraryPage;