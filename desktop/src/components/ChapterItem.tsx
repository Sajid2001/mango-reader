import React from "react";
import { Link } from "react-router-dom";
import { IconDownload } from "@tabler/icons-react";
import { LibraryEntry } from "../models/libraryEntry";
import { ChapterDetails } from "../models/chapterDetails";

interface Props {
  mangaId: number;
  chapter: ChapterDetails;
  reading?: LibraryEntry;
}

const ChapterItem = ({ mangaId, chapter, reading }: Props) => (
  <Link
    to={`/reader/${mangaId}/${chapter.chapterNumber}`}
    className={`flex justify-between p-3 items-center font-bold hover:bg-secondary ${
      reading && reading.progress >= chapter.chapterNumber && "font-thin"
    }`}
  >
    <div className="flex-col">
      <p className="text-md">{chapter.chapterName}</p>
      <p>{chapter.chapterNumber}</p>
    </div>
    <div>
      <button className="bg-primary border-2 border-background rounded-lg text-text py-1 px-3 mr-4 hover:bg-primary active:bg-accent">
        <IconDownload />
      </button>
    </div>
  </Link>
);

export default React.memo(ChapterItem);
