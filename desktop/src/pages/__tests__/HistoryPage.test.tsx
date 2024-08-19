import {
  act,
  render,
  waitFor,
  screen,
  fireEvent,
} from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
import HistoryPage from "../HistoryPage";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import {
  loadLibrary,
  updateLibraryEntry,
} from "../../fileStorage/libraryStorage";
import { LibraryEntry } from "../../models/libraryEntry";

jest.mock("../../fileStorage/libraryStorage", () => ({
  loadLibrary: jest.fn(),
  updateLibraryEntry: jest.fn(),
}));

const mockLibraryData: LibraryEntry[] = [
  {
    manga: {
      mangaId: 1,
      title: "One Piece",
      totalChapters: 1000,
      coverImage: "one_piece.jpg",
    },
    progress: 13,
    lastViewed: new Date("2022-01-01"),
    lastReadChapterName: "Chapter 1",
  },
  {
    manga: {
      mangaId: 2,
      title: "Naruto",
      totalChapters: 700,
      coverImage: "naruto.jpg",
    },
    progress: 14,
    lastViewed: new Date("2022-01-02"),
    lastReadChapterName: "Chapter 2",
  },
];

describe("HistoryPage Component", () => {
  beforeEach(() => {
    (loadLibrary as jest.Mock).mockResolvedValue(mockLibraryData);
    (updateLibraryEntry as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the history page properly", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <HistoryPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("One Piece")).toBeInTheDocument();
      expect(screen.getByText("Naruto")).toBeInTheDocument();
      const playButtons = screen.getAllByTestId("play-button");
      expect(playButtons.length).toBe(2);
      const deleteButtons = screen.getAllByTestId("delete-button");
      expect(deleteButtons.length).toBe(2);
    });
  });

  it("navigates to the manga page when a manga card is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<HistoryPage />} />
            <Route
              path="/reader/:mangaId/:chapterId"
              element={<div>Reader Page</div>}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    const playButtons = await waitFor(() =>
      screen.getAllByTestId("play-button")
    );
    expect(playButtons.length).toBe(2);
    playButtons.forEach((playButton) => {
      fireEvent.click(playButton);
      expect(screen.getByText(/reader page/i)).toBeInTheDocument();
    });
  });

  it("deletes the manga when the delete button is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <HistoryPage />
        </MemoryRouter>
      );
    });

    // Wait for delete buttons to appear
    const deleteButtons = await waitFor(() =>
      screen.getAllByTestId("delete-button")
    );
    expect(deleteButtons.length).toBe(2);

    const sortedLibraryData = [...mockLibraryData].sort((a, b) => {
      return b.lastViewed!.getTime() - a.lastViewed!.getTime();
    });

    deleteButtons.forEach(async (deleteButton, index) => {
      fireEvent.click(deleteButton);
      waitFor(() => {
        expect(updateLibraryEntry).toHaveBeenCalledTimes(index + 1);
        expect(updateLibraryEntry).toHaveBeenCalledWith(
          expect.objectContaining({
            lastViewed: undefined,
            lastReadChapterName: undefined,
            manga: expect.objectContaining(sortedLibraryData[index].manga),
          })
        );
      });
    });
  });
});
