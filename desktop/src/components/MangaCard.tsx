
interface MangaCardProps {
    title?: string;
    description?: string;
    image?: string;
}

const MangaCard = ({ title, description, image }: MangaCardProps) => {
    return (  
        <div className="w-40 h-60 rounded-2xl relative">
            <img className="rounded-2xl" src="https://image.tmdb.org/t/p/original/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg" alt="" />
            <div className="h-full w-full rounded-2xl absolute bottom-0 z-10 bg-slate-500 bg-opacity-35 transition ease-in-out duration-300 opacity-0 hover:opacity-100">
                <p className="py-1 px-2 font-bold text-white">{description}</p>
                <p className="py-1 px-2 font-bold text-white bottom-0">{title}</p>
            </div>
        </div>
    );
}
 
export default MangaCard;