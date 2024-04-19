import { Link } from "react-router-dom";

interface MangaCardProps {
    mangaId?: number;
    title?: string;
    image?: string;
    chapters?: number;
}

const MangaCard = ({ mangaId, title, chapters, image }: MangaCardProps) => {
    return (  
        <div className="w-min-20 rounded-2xl relative drop-shadow-lg">
            <Link to={`/manga/${mangaId}`}>
                <img className="rounded-2xl" src={image} alt="" />
                <div className="flex flex-col items-stretch h-full w-full rounded-2xl absolute bottom-0 z-10 bg-slate-500 bg-opacity-35 transition ease-in-out duration-300 opacity-0 hover:opacity-100">
                    {chapters != null &&
                        <div className=" mx-3 pt-2 text-2xl font-bold bg-slate-500 text-white h-14 w-14 text-center align-middle  justify-items-center bg-opacity-90">
                            {chapters/1000 < 1 ? chapters : `${Math.round(chapters/1000)}K+`}
                        </div>
                    }
                    <p className="absolute py-1 px-2 text-xl font-bold text-white bottom-0">{title}</p>
                    
                </div>
            </Link>
            
        </div>
    );
}
 
export default MangaCard;