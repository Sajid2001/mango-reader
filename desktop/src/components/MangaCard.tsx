import { Link } from "react-router-dom";

interface MangaCardProps {
    mangaId?: number;
    title?: string;
    image?: string;
    chapers?: number;
}

const MangaCard = ({ mangaId, title, chapers, image }: MangaCardProps) => {
    return (  
        <div className="w-min-20 rounded-2xl relative drop-shadow-lg">
            <Link to={`/manga/${mangaId}`}>
                <img className="rounded-2xl" src={image} alt="" />
                <div className="flex flex-col items-stretch h-full w-full rounded-2xl absolute bottom-0 z-10 bg-slate-500 bg-opacity-35 transition ease-in-out duration-300 opacity-0 hover:opacity-100">
                    {chapers != null &&
                        <div className="mx-3 p-2 text-2xl font-bold bg-slate-500 text-white h-14 w-12 text-center bg-opacity-90">
                            {chapers}
                        </div>
                    }
                    <p className="absolute py-1 px-2 text-xl font-bold text-white bottom-0">{title}</p>
                    
                </div>
            </Link>
            
        </div>
    );
}
 
export default MangaCard;