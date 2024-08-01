import {
  IconArrowAutofitHeight,
  IconArrowAutofitWidth,
  IconArrowBackUp,
  IconBook,
  IconChevronLeft,
  IconChevronRight,
  IconCircleArrowLeft,
  IconCircleArrowRight,
  IconKeyboard,
  IconSettings,
  IconSpacingVertical,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getLibrary,
  loadLibrary,
  updateLibraryEntry,
} from "../fileStorage/libraryStorage";
import { LibraryEntry } from "../models/libraryEntry";
import { getSettings, loadSettings } from "../fileStorage/settingsStorage";

const ReaderPage = () => {
  // [ VALUES ]

  //Fixed Values
  const IconSize = 28;

  //Params
  const { mangaId, chapterId } = useParams();

  //Navigation
  const navigate = useNavigate();

  //Primary Reader Values
  const [scans, setScans] = useState<string[]>([]);
  const [mangaName, setMangaName] = useState<string>("test");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxChapters, setMaxChapters] = useState<number>(0);
  const [chapterName, setChapterName] = useState<string>("test");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  //Sidebar Option Values
  const [sidebarToggled, setSidebarToggled] = useState<boolean>(false);
  const [singlePage, setSinglePage] = useState<boolean>(false);
  const [fitHeight, setFitHeight] = useState<boolean>(true);
  const [leftToRight, setLeftToRight] = useState<boolean>(true);
  const [pageGap, setPageGap] = useState<number>(90);

  //References
  const scanRefs = useRef<(HTMLImageElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  //Library
  const [reading, setReading] = useState<LibraryEntry | null>(null);

  // [ FUNCTIONS ]

  //Use Effect for getting Manga Specifc Data
  useEffect(() => {
    if (mangaId) {
      //Loads User Settings else default Settings are employed
      loadSettings().then(() => {
        getSettings().then((settings) => {
          if (settings) {
            setSinglePage(
              settings.defaultSinglePage ? settings.defaultSinglePage : false
            );
            setFitHeight(
              settings.defaultFitHeight ? settings.defaultFitHeight : true
            );
            setLeftToRight(
              settings.defaultLeftToRight ? settings.defaultLeftToRight : false
            );
          }
        });
      });

      // Checks if manga is already in library
      loadLibrary().then(() => {
        getLibrary().then((library) => {
          const previousReading = library.some(
            (entry) => entry.manga.mangaId === Number(mangaId)
          );
          if (previousReading) {
            setReading(() => {
              const entry = library.find(
                (entry) => entry.manga.mangaId === Number(mangaId)
              );
              if (entry) {
                entry.progress = Number(chapterId);
                entry.lastViewed = new Date();
                entry.lastReadChapterName = chapterName;
                updateLibraryEntry(entry);
                return entry;
              } else return null;
            });
          }
        });
      });
    }

    //Gets Manga Info such as name and total chapters
    fetch("http://127.0.0.1:8000/api/manga/" + Number(mangaId))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Map fetched data to Post model
        setMangaName(data.title);
        setMaxChapters(data.total_chapters);
      })
      .catch((error) => console.error("Error fetching chapter data:", error));
  }, [mangaId]);

  //Use Effect for getting Chapter Specifc Data
  useEffect(() => {
    let isCurrent = true;
    const getChapterData = async () => {
      setLoading(true);
      fetch(
        `http://127.0.0.1:8000/api/chapters/${Number(mangaId)}/${Number(
          chapterId
        )}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(async (data) => {
          // Map fetched data to Post model
          console.log(data);
          setChapterName(data.chapter_name);
          setIsProcessing(data.is_processing);

          if (!data.is_processing) {
            fetch(
              "http://127.0.0.1:8000/api/chapters/" +
                Number(mangaId) +
                "/" +
                Number(chapterId) +
                "/pages"
            )
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                // Map fetched data to Post model
                const mappedData = data.map((chapter: any) => chapter.scan_url);
                setScans(mappedData);
                setLoading(false);
                setIsProcessing(false);
              })
              .catch((error) =>
                console.error("Error fetching chapter data:", error)
              );
          } else {
            if (isCurrent) {
              setTimeout(() => {
                getChapterData();
              }, 3000);
            }
          }
        })
        .catch((error) => console.error("Error fetching chapter data:", error));
    };

    getChapterData();

    //If Chapter info is late loaded, then isCurrent is set to false and the data isnt used
    return () => {
      isCurrent = false;
      setCurrentPage(1);
    };
  }, [mangaId, chapterId]);

  const updateCurrentLibraryEntry = async () => {
    const updatedReading = reading!;
    updatedReading.progress = Number(chapterId);
    updatedReading.lastViewed = new Date();
    updatedReading.lastReadChapterName = chapterName;
    setReading(updatedReading);
    updateLibraryEntry(updatedReading);
  };

  useEffect(() => {
    if (reading != null && chapterName != null) {
      updateCurrentLibraryEntry();
    }
  }, [reading, chapterName]);

  //Key Press Listener
  const handleKeyPress = (event: KeyboardEvent) => {
    console.log(`Key pressed: ${event.key}`);
    console.log(
      `Current chapterId: ${chapterId}, Max chapters: ${maxChapters}`
    );

    const navigatePages = (direction: string) => {
      if (scans.length > 0) {
        if (direction === "previous") {
          previousPage();
        } else if (direction === "next") {
          nextPage();
        }
      }
    };

    const navigateChapters = (direction: string) => {
      if (direction === "previous") {
        if (Number(chapterId) > 1) {
          previousChapter();
        }
      } else if (direction === "next") {
        if (Number(chapterId) < maxChapters) {
          nextChapter();
        }
      }
    };

    switch (event.key) {
      case "ArrowLeft":
        if (leftToRight) {
          navigatePages("previous");
        } else {
          navigatePages("next");
        }
        break;

      case "ArrowRight":
        if (leftToRight) {
          navigatePages("next");
        } else {
          navigatePages("previous");
        }
        break;
      case "[":
        if (leftToRight) {
          navigateChapters("previous");
        } else {
          navigateChapters("next");
        }
        break;

      case "]":
        if (leftToRight) {
          navigateChapters("next");
        } else {
          navigateChapters("previous");
        }
        break;
      case "s":
        setSidebarToggled((sidebarToggled) => !sidebarToggled);
        break;
      case "Escape":
        navigate("/manga/" + mangaId);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyPress);

    // Cleans up event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [chapterId, currentPage, scans.length, leftToRight]);

  //Page Change Functions
  const nextPage = () => {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, scans.length));
    if (singlePage) window.scrollTo({ top: 0, behavior: "instant" });
    else scanRefs.current[currentPage]?.scrollIntoView({ behavior: "instant" });
  };

  const previousPage = () => {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
    if (singlePage) window.scrollTo({ top: 0, behavior: "instant" });
    else
      scanRefs.current[currentPage - 2]?.scrollIntoView({
        behavior: "instant",
      });
  };

  //Chapter Change Functions
  const nextChapter = async () => {
    const url = `/reader/${mangaId}/${Math.min(
      Number(chapterId) + 1,
      maxChapters
    )}`;
    console.log(url);
    navigate(url);
  };

  const previousChapter = async () => {
    const url = `/reader/${mangaId}/${Math.max(Number(chapterId) - 1, 1)}`;
    console.log(url);
    navigate(url);
  };

  //UseEffect for Keeping View at Current Page if Longstrip is Turned On and Settings are Changed
  useEffect(() => {
    if (!singlePage)
      scanRefs.current[currentPage - 1]?.scrollIntoView({
        behavior: "instant",
      });
  }, [singlePage, fitHeight]);

  //UseEffect for Setting up Observer for Telling what Page the User is On when Longstring is Turned On
  //is technically also active when singlePage is on but its not needed since only one page is shown at a time
  useEffect(() => {
    scanRefs.current = scanRefs.current.slice(0, scans.length);

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleRatio = 0;
        let maxVisibleIndex = -1;

        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.intersectionRatio > maxVisibleRatio
          ) {
            maxVisibleRatio = entry.intersectionRatio;
            maxVisibleIndex = scanRefs.current.indexOf(
              entry.target as HTMLImageElement
            );
          }
        });

        if (maxVisibleIndex !== -1) {
          setCurrentPage(maxVisibleIndex + 1);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: Array.from(Array(101).keys(), (k) => k / 100), // finer control over visibility thresholds
      }
    );

    scanRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      scanRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [scans, singlePage]);

  // Helper function to determine tabIndex
  const getPageTabIndex = (
    isLeftToRight: boolean,
    isFirstPage: boolean,
    isLastPage: boolean
  ) => {
    if (isLeftToRight) {
      return isFirstPage ? -1 : 0;
    } else {
      return isLastPage ? -1 : 0;
    }
  };

  // Helper function to determine className for pointer-events and hover effects
  const getPageButtonClass = (
    isLeftToRight: boolean,
    isFirstPage: boolean,
    isLastPage: boolean
  ) => {
    if (isLeftToRight) {
      return isFirstPage ? "pointer-events-none" : "hover:bg-primary";
    } else {
      return isLastPage ? "pointer-events-none" : "hover:bg-primary";
    }
  };

  // Helper function to determine icon color class
  const getPageIconClass = (
    isLeftToRight: boolean,
    isFirstPage: boolean,
    isLastPage: boolean
  ) => {
    if (isLeftToRight) {
      return isFirstPage ? "text-secondary" : "text-text";
    } else {
      return isLastPage ? "text-secondary" : "text-text";
    }
  };

  // Function to navigate to the previous page
  const navigatePreviousPage = () => {
    if (leftToRight) {
      if (currentPage > 1) previousPage();
    } else {
      if (currentPage < scans.length) nextPage();
    }
  };

  // Function to navigate to the next page
  const navigateNextPage = () => {
    if (leftToRight) {
      if (currentPage < scans.length) nextPage();
    } else {
      if (currentPage > 1) previousPage();
    }
  };

  // Helper function to determine tabIndex for chapter navigation
  const getChapterTabIndex = (
    isLeftToRight: boolean,
    chapterId: number,
    maxChapters: number
  ) => {
    return (isLeftToRight && chapterId <= 1) ||
      (!isLeftToRight && chapterId >= maxChapters)
      ? -1
      : 0;
  };

  // Helper function to determine className for chapter navigation buttons
  const getChapterButtonClass = (
    isLeftToRight: boolean,
    chapterId: number,
    maxChapters: number
  ) => {
    return (isLeftToRight && chapterId <= 1) ||
      (!isLeftToRight && chapterId >= maxChapters)
      ? "pointer-events-none"
      : "hover:bg-primary";
  };

  // Helper function to determine icon color class for chapter navigation
  const getChapterIconClass = (
    isLeftToRight: boolean,
    chapterId: number,
    maxChapters: number
  ) => {
    return (isLeftToRight && chapterId <= 1) ||
      (!isLeftToRight && chapterId >= maxChapters)
      ? "text-secondary"
      : "text-text";
  };

  // Function to navigate to the previous chapter
  const navigatePreviousChapter = () => {
    if (leftToRight) {
      if (Number(chapterId) > 1) previousChapter();
    } else {
      if (Number(chapterId) < maxChapters) nextChapter();
    }
  };

  // Function to navigate to the next chapter
  const navigateNextChapter = () => {
    if (leftToRight) {
      if (Number(chapterId) < maxChapters) nextChapter();
    } else {
      if (Number(chapterId) > 1) previousChapter();
    }
  };

  return (
    <div className="flex px-4 justify-center overflow-y-auto">
      {sidebarToggled ? (
        <div className="fixed z-10 top-0 left-0 h-screen w-72 bg-primary-70 text-text overflow-y-auto">
          <div className="flex flex-col p-6 *:mb-3">
            <div className="flex font-bold text-2xl gap-1">
              <button onClick={() => setSidebarToggled(false)}>
                <IconX size={IconSize} />
              </button>
              <p className="truncate">{mangaName}</p>
            </div>
            <div className="flex flex-col w-full font-semibold px-5 text-lg *:w-full *:flex *:px-2 *:py-1 *:items-center *:justify-between  *:bg-secondary *:rounded-lg *:my-2">
              <div className="*:rounded-lg">
                <button
                  onClick={navigatePreviousChapter}
                  tabIndex={getChapterTabIndex(
                    leftToRight,
                    Number(chapterId),
                    maxChapters
                  )}
                  className={getChapterButtonClass(
                    leftToRight,
                    Number(chapterId),
                    maxChapters
                  )}
                >
                  <IconChevronLeft
                    size={IconSize}
                    className={getChapterIconClass(
                      leftToRight,
                      Number(chapterId),
                      maxChapters
                    )}
                  />
                </button>
                <p className="text-center">{chapterName}</p>
                <button
                  onClick={navigateNextChapter}
                  tabIndex={getChapterTabIndex(
                    !leftToRight,
                    Number(chapterId),
                    maxChapters
                  )}
                  className={getChapterButtonClass(
                    !leftToRight,
                    Number(chapterId),
                    maxChapters
                  )}
                >
                  <IconChevronRight
                    size={IconSize}
                    className={getChapterIconClass(
                      !leftToRight,
                      Number(chapterId),
                      maxChapters
                    )}
                  />
                </button>
              </div>

              <div className="*:rounded-lg">
                <button
                  onClick={navigatePreviousPage}
                  tabIndex={getPageTabIndex(
                    leftToRight,
                    currentPage <= 1,
                    currentPage >= scans.length
                  )}
                  className={getPageButtonClass(
                    leftToRight,
                    currentPage <= 1,
                    currentPage >= scans.length
                  )}
                >
                  <IconChevronLeft
                    size={IconSize}
                    className={getPageIconClass(
                      leftToRight,
                      currentPage <= 1,
                      currentPage >= scans.length
                    )}
                  />
                </button>
                {currentPage}/{scans.length}
                <button
                  onClick={navigateNextPage}
                  tabIndex={getPageTabIndex(
                    leftToRight,
                    currentPage >= scans.length,
                    currentPage <= 1
                  )}
                  className={getPageButtonClass(
                    leftToRight,
                    currentPage >= scans.length,
                    currentPage <= 1
                  )}
                >
                  <IconChevronRight
                    size={IconSize}
                    className={getPageIconClass(
                      leftToRight,
                      currentPage >= scans.length,
                      currentPage <= 1
                    )}
                  />
                </button>
              </div>
            </div>
            <div className="flex flex-col w-full font-semibold px-5 text-lg  *:*::w-full *:*:flex *:px-2 *:py-1 *:*:items-center *:*:justify-between  *:bg-secondary *:rounded-lg *:my-2">
              <button
                onClick={() => setSinglePage(!singlePage)}
                className="hover:bg-primary"
              >
                {singlePage ? (
                  <div>
                    Single Page <IconBook size={IconSize} />
                  </div>
                ) : (
                  <div>
                    Longstrip <IconSpacingVertical size={IconSize} />
                  </div>
                )}
              </button>
              <button
                onClick={() => setFitHeight(!fitHeight)}
                className="hover:bg-primary"
              >
                {fitHeight ? (
                  <div>
                    Fit Height <IconArrowAutofitHeight size={IconSize} />
                  </div>
                ) : (
                  <div>
                    Fit Width <IconArrowAutofitWidth size={IconSize} />
                  </div>
                )}
              </button>
              <button
                onClick={() => setLeftToRight(!leftToRight)}
                className="hover:bg-primary"
              >
                {leftToRight ? (
                  <div>
                    Left to Right <IconCircleArrowRight size={IconSize} />
                  </div>
                ) : (
                  <div>
                    Right to Left <IconCircleArrowLeft size={IconSize} />
                  </div>
                )}
              </button>
              
              <button className="hover:bg-primary">
                <div>
                  Keybinds <IconKeyboard size={IconSize} />
                </div>
              </button>
              <button className="hover:bg-primary">
                <div>
                  Settings <IconSettings size={IconSize} />
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setSidebarToggled(true)}
          className="fixed top-10 left-14 p-3 bg-primary-40 hover:bg-primary-80 rounded-lg"
        >
          <IconChevronLeft size={28} />
        </button>
      )}
      {scans.length > 0 && !loading ? (
        <div>
          {singlePage ? (
            <img
              src={scans[currentPage - 1]}
              className={`${
                fitHeight ? "h-screen" : "w-screen"
              } flex justify-self-center`}
            />
          ) : (
            <div className="grid grid-cols-1" ref={containerRef}>
              {scans.map((scan: string, index: number) => (
                <img
                  key={index}
                  src={scan}
                  ref={(el) => (scanRefs.current[index] = el)}
                  id={`${index + 1}`}
                  className={`${
                    fitHeight ? "h-screen" : "w-screen"
                  } mb-[${pageGap.toString()}px] flex justify-self-center`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center w-screen h-screen">
          <svg
            aria-hidden="true"
            className="w-16 h-16 text-secondary animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <p className="font-bold mt-2">
            {isProcessing ? `Already Processing` : `Loading`}
          </p>
        </div>
      )}
      <Link
        to={`/manga/${mangaId}`}
        className="fixed top-10 right-14 text-3xl p-3 font-bold bg-accent-40 hover:bg-accent-80 rounded-lg"
      >
        <IconArrowBackUp size={28} className="text-background" />
      </Link>
    </div>
  );
};

export default ReaderPage;
