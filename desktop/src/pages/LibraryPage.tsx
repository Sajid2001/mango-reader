import MangaCard from "../components/MangaCard";

const LibraryPage = () => {
    return ( 
        <div className='h-screen bg-gray-100 mx-5'>
            <h1 className="text-3xl m-4 font-bold row">Library</h1>
            <div className="grid grid-cols-4 gap-3">
                
                <MangaCard />
                <MangaCard />
                <MangaCard />
                <MangaCard />
                <MangaCard />
                <MangaCard />
            </div>
        </div> 
    );
}
 
export default LibraryPage;