import { Link } from "react-router-dom";
import React from "react";

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
        <img
          className="aspect-[2/3] rounded-2xl object-fit h-full w-full"
          src={image}
          alt="cover image"
        />
        <div className="flex flex-col items-stretch h-full w-full rounded-2xl absolute bottom-0 z-10 bg-secondary-30 transition ease-in-out duration-300 opacity-0 hover:opacity-100">
          {chapters != null && (
            <div className=" mx-3 pt-2 text-2xl font-bold bg-primary text-text h-14 w-14 text-center align-middle justify-items-center">
              {chapters / 1000 < 1
                ? chapters
                : `${Math.round(chapters / 1000)}K+`}
            </div>
          )}
          <p className="absolute py-1 px-2 text-xl font-bold text-white bottom-0">
            {title}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default React.memo(MangaCard);
