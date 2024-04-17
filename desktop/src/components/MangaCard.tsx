import { Link } from "react-router-dom";

interface MangaCardProps {
    mangaId?: number;
    title?: string;
    description?: string;
    image?: string;
}

const MangaCard = ({ mangaId, title, description, image }: MangaCardProps) => {
    return (  
        <div className="w-auto rounded-2xl relative drop-shadow-lg">
            <Link to={`/manga/${mangaId}`}>
                <img className="rounded-2xl" src={image} alt="" />
                <div className="h-full w-full rounded-2xl absolute bottom-0 z-10 bg-slate-500 bg-opacity-35 transition ease-in-out duration-300 opacity-0 hover:opacity-100">
                <p className="py-1 px-2 font-bold text-white h-1/6">{title}</p>
                    <p className="py-1 px-2 font-bold text-white h-5/6">{description}</p>
                    
                </div>
            </Link>
            
        </div>
    );
}
 
export default MangaCard;