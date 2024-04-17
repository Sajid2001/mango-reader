import MangaCard from "../components/MangaCard";

const LibraryPage = () => {
    return ( 
        <div className='h-screen bg-gray-100 px-5 w-full'>
            <h1 className="text-3xl p-4 font-bold">Library</h1>
            <div className="grid grid-col-4 grid-row-3 grid-flow-col gap-3">
                
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
                
                
            </div>
        </div> 
    );
}
 
export default LibraryPage;