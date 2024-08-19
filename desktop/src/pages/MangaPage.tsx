import {
  IconArrowDown,
  IconArrowUp,
  IconCheck,
  IconClock,
  IconClockPause,
  IconMinus,
  IconPlayerPlay,
  IconPlus,
  IconTrafficCone,
} from "@tabler/icons-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addEntryToLibrary,
  // getLibrary,
  loadLibrary,
  removeEntryFromLibrary,
} from "../fileStorage/libraryStorage";
import { MangaDetails } from "../models/mangaDetails";
import { LibraryEntry } from "../models/libraryEntry";
import { ChapterDetails } from "../models/chapterDetails";
import ChapterList from "../components/ChapterList";

const MangaPage = () => {
  // [ State Variables ]
  const [chapters, setChapters] = useState<ChapterDetails[]>([]);
  const [reading, setReading] = useState<LibraryEntry | null>();
  const [loadingChapters, setLoadingChapters] = useState<boolean>(true);
  const [ascending, setAscending] = useState<boolean>(false);

  // Navigation
  const navigate = useNavigate();

  // Params
  const { id } = useParams();

  // Page Specific Interface
  interface MangaExtDetails {
    id: number;
    mangaka: string;
    alternateNames: string;
    name: string;
    genres: string[];
    description: string;
    publishStatus: string;
    scanStatus: string;
    totalChapters: number;
    bannerImage: string;
    coverImage: string;
  }

  // Manga State and Default Test Data
  const [manga, setManga] = useState<MangaExtDetails>({
    id: -1,
    mangaka: "Unknown Author",
    alternateNames: "",
    name: "No Manga Found",
    genres: [],
    description: "",
    publishStatus: "Unknown",
    scanStatus: "Unknown",
    totalChapters: 0,
    bannerImage:
      "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg",
    coverImage:
      "https://static.vecteezy.com/system/resources/previews/005/337/799/non_2x/icon-image-not-found-free-vector.jpg",
  });

  // [ Functions]

  // Gets Manga Data on Page Load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/manga/" + id)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);

        // Map fetched data to Post model
        const mappedData: MangaExtDetails = {
          id: data.id,
          mangaka: data.authors,
          alternateNames:
            data.alternateNames != null || data.alternateNames != "None"
              ? data.alternate_names
              : "l",
          name: data.title,
          genres: data.genres.split(", "),
          description: data.description,
          publishStatus: data.publish_status,
          scanStatus: data.scan_status,
          totalChapters: data.total_chapters,
          bannerImage: data.banner_image,
          coverImage: data.cover_image,
        };
        //console.log(mappedData)
        setManga(mappedData);
      })
      .catch((error) => console.error("Error fetching manga data:", error));
  }, []);

  //After Manga Data is Found, Gets Chapter Data and Checks Library
  useEffect(() => {
    if (manga.id != -1) {
      setLoadingChapters(true);
      loadLibrary().then((library) => {
        const previousReading = library.some(
          (entry) => entry.manga.mangaId === manga.id
        );
        if (previousReading) {
          setReading(library.find((entry) => entry.manga.mangaId == manga.id)!);
        }
      });

      fetch("http://127.0.0.1:8000/api/chapters/" + manga.id)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          // Map fetched data to Post model
          const mappedData: ChapterDetails[] = data.map((post: any) => ({
            mangaId: post.series_id,
            chapterNumber: post.chapter_number,
            chapterName: post.chapter_name,
          }));
          if (ascending) setChapters(mappedData);
          else setChapters(mappedData.reverse());
          setLoadingChapters(false);
        })
        .catch((error) => {
          console.error("Error fetching chapter data:", error);
          setLoadingChapters(false);
        });
    }
  }, [manga]);

  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const toggleDescriptionExpansion = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  const startSeries = async () => {
    if (reading != null) {
      console.log("Already reading");
      return;
    }
    const mangaDetails: MangaDetails = {
      mangaId: manga.id,
      title: manga.name,
      totalChapters: manga.totalChapters,
      coverImage: manga.coverImage,
    };
    const newEntry: LibraryEntry = {
      manga: mangaDetails,
      progress: 0,
      lastViewed: new Date(),
    };
    addEntryToLibrary(newEntry);
    setReading(newEntry);
  };

  const startReadingNow = () => {
    startSeries();
    navigate(`/reader/${manga.id}/1`);
  };

  const continueReading = () => {
    navigate(`/reader/${manga.id}/${reading!.progress}`);
  };

  const stopSeries = () => {
    if (reading == null) {
      console.log("Already removed from library");
      return;
    }
    removeEntryFromLibrary(manga.id);
    setReading(null);
  };

  const sortChapters = useCallback(() => {
    setChapters((prevChapters) => {
      const sortedChapters = [...prevChapters].sort((a, b) =>
        ascending
          ? b.chapterNumber - a.chapterNumber
          : a.chapterNumber - b.chapterNumber
      );
      return sortedChapters;
    });
    setAscending((prevAscending) => !prevAscending);
  }, [ascending]);

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const chapterScroll = useRef<any>(null);
  const targetRef = useRef<any>(null);

  const handleScroll = () => {
    if (chapterScroll.current.scrollTop > 100) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTarget = () => {
    if (chapterScroll.current && targetRef.current) {
      const targetPosition = targetRef.current.offsetTop;
      chapterScroll.current.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  };

  function getStatusIcon(status: string) {
    if (status === "Ongoing") {
      return <IconClock />;
    } else if (status === "Complete") {
      return <IconCheck />;
    } else if (status === "Hiatus") {
      return <IconClockPause />;
    } else {
      return <IconTrafficCone />;
    }
  }

  useEffect(() => {
    const scrollableDiv = chapterScroll.current;
    scrollableDiv.addEventListener("scroll", handleScroll);

    return () => {
      scrollableDiv.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div ref={chapterScroll} className="h-screen overflow-y-auto">
      <div className="h-48 w-dull">
        <img
          src={manga.bannerImage}
          alt=""
          className="h-full object-cover w-full"
        />
      </div>
      <div ref={targetRef} className="flex flex-col mt-2">
        <div className="sticky top-0 z-20 bg-background">
          <div className=" pl-4 pt-4 pr-2 inline-block align-baseline">
            <p className="text-3xl font-bold">
              {manga.name}
              {!showScrollToTop && (
                <span className="pl-3 font-semibold text-sm">
                  {manga.alternateNames}
                </span>
              )}
            </p>
          </div>
          {!showScrollToTop && (
            <div className="flex px-3 flex-wrap *:mt-2">
              {manga.genres != null ? (
                manga.genres.map((genre) => (
                  <div className="bg-secondary bg p-1 font-semibold mx-1 rounded-md px-2">
                    {genre}
                  </div>
                ))
              ) : (
                <div className="bg-slate-300 bg p-1 font-semibold mx-1 rounded-md">
                  No Associated Genres
                </div>
              )}
            </div>
          )}
          {!showScrollToTop && (
            <div className="flex px-4 py-2">
              {manga.description.length > 580 && !descriptionExpanded
                ? manga.description.slice(0, 580) + "..."
                : manga.description}
            </div>
          )}

          {!showScrollToTop && manga.description.length > 580 && (
            <div>
              <button
                onClick={toggleDescriptionExpansion}
                className="flex px-4 -translate-y-3 font-bold text-primary hover:text-slate-800 items-center"
              >
                Show more
              </button>
            </div>
          )}

          {!showScrollToTop && (
            <div className="flex *:pl-4 font-semibold">
              <p>{manga.mangaka}</p>
              <div className="font-bold flex *:mr-2 flex-wrap">
                <div className="flex">
                  {getStatusIcon(manga.scanStatus)}
                  <p className="pl-1">{manga.scanStatus} [Scan Status]</p>
                </div>
                <div className="flex">
                  {getStatusIcon(manga.publishStatus)}
                  <p className="pl-1">
                    {manga.publishStatus} [Publishing Status]
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center m-auto border-b-2 p-4 font-bold border-primary justify-between">
            <p>
              {manga.totalChapters == null || manga.totalChapters == 0
                ? "No Chapters Available"
                : manga.totalChapters == 1
                ? "1 Chapter"
                : `${manga.totalChapters} Chapters`}
            </p>
            <div className="flex">
              <div className="flex">
                <button
                  onClick={() => sortChapters()}
                  className="flex bg-primary rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:opacity-70 items-center"
                >
                  {" "}
                  {ascending ? (
                    <IconArrowUp size={20} />
                  ) : (
                    <IconArrowDown size={20} />
                  )}
                </button>
                {reading != null && reading.progress > 0 ? (
                  <button
                    onClick={continueReading}
                    className="flex bg-primary rounded-lg text-white py-1 px-3 mr-4 justify-self-end hover:opacity-70"
                  >
                    {" "}
                    Continue <IconPlayerPlay className="pl-2" />
                  </button>
                ) : (
                  <button
                    onClick={startReadingNow}
                    className="flex bg-primary rounded-lg text-text py-1 px-3 mr-4 justify-self-end hover:opacity-70"
                  >
                    {" "}
                    Start <IconPlayerPlay className="pl-2" />
                  </button>
                )}
                {reading == null ? (
                  <button
                    onClick={startSeries}
                    className="flex bg-accent rounded-lg text-background py-1 px-3 hover:opacity-70 mr-4 justify-self-end"
                  >
                    {" "}
                    Add to Library <IconPlus className="pl-2" />
                  </button>
                ) : (
                  <button
                    onClick={stopSeries}
                    className="flex bg-accent rounded-lg text-background py-1 px-3 mr-4 justify-self-end hover:opacity-70"
                  >
                    {} Remove from Library <IconMinus className="pl-2" />
                  </button>
                )}
                <div className="flex"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="[scrollbarWidth:none] grid grid-cols-1 gap-1">
          <ChapterList
            chapters={chapters}
            manga={manga}
            reading={reading}
            loadingChapters={loadingChapters}
          />
          <button
            onClick={scrollToTarget}
            disabled={!showScrollToTop}
            className="flex items-center fixed justify-center transition ease-in-out bottom-3 disabled:translate-y-20 hover:opacity-70 bg-primary text-text px-2 py-1 rounded-lg left-[47%] gap-1 font-semibold"
          >
            <IconArrowUp size={20} />
            Scroll to Top
          </button>
        </div>
      </div>
    </div>
  );
};

export default MangaPage;
