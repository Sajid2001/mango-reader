import { IconMoon } from "@tabler/icons-react";
import MangaCard from "../components/MangaCard";

const LibraryPage = () => {
    return ( 
        <div className='h-screen bg-gray-100 px-5 w-full'>
            <div className="w-full flex ">
                <h1 className="text-3xl p-4 font-bold">Library</h1>
                <button className="font-semibold text-lg px-3 m-3  bg-slate-300 rounded-lg border-2 active:bg-slate-200">Layout</button>
                <button className="font-semibold px-3 m-3  bg-slate-300 rounded-lg border-2 active:bg-slate-200"><IconMoon size={24}/></button>
                <input className="font-semibold w-1/3 h-8 mt-3 mx-2 p-3 py-5 mb-1  text-lg rounded-lg border-2 align-middle bg-slate-300 placeholder:text-black" placeholder="Search Library..."/>
                
                
            </div>
            
            <div className="grid grids-col-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                
                <MangaCard 
                    title="Manga Title"
                    description="Manga descriptionation ahhhhhhhh"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                <MangaCard 
                    title="Manga Title"
                    description="Manga description"
                    image="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg"
                />
                
                
            </div>
        </div> 
    );
}
 
export default LibraryPage;