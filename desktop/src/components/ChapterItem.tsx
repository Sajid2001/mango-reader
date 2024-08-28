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
  <div className="w-full flex">
    <Link
      to={`/reader/${mangaId}/${chapter.chapterNumber}`}
      className={`flex justify-between p-3 items-center font-bold hover:bg-secondary hover:opacity-80 w-full ${
        reading && reading.progress >= chapter.chapterNumber && "font-light"
      }`}
    >
      <div className="flex-col">
        <p className="text-md">{chapter.chapterName}</p>
        <p>{chapter.chapterNumber}</p>
      </div>
    </Link>
    <div className="flex bg-accent p-2 items-center justify-center">
      <button className="bg-primary border-2 border-background rounded-lg text-text py-1 px-3 mx-4 hover:bg-background active:bg-accent">
        <IconDownload />
      </button>
    </div>
  </div>
);

export default React.memo(ChapterItem);
