import {
  act,
  render,
  waitFor,
  screen,
  fireEvent,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LibraryPage from "../LibraryPage";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { loadLibrary } from "../../fileStorage/libraryStorage";
import { LibraryEntry } from "../../models/libraryEntry";

// Mocking the libraryStorage functions
jest.mock("../../fileStorage/libraryStorage", () => ({
  loadLibrary: jest.fn(),
}));

const mockLibraryData: LibraryEntry[] = [
  {
    manga: {
      mangaId: 1,
      title: "One Piece",
      totalChapters: 1000,
      coverImage: "one_piece.jpg",
    },
    progress: 0,
  },
  {
    manga: {
      mangaId: 2,
      title: "Naruto",
      totalChapters: 700,
      coverImage: "naruto.jpg",
    },
    progress: 0,
  },
];

describe("LibraryPage", () => {
  beforeEach(() => {
    (loadLibrary as jest.Mock).mockResolvedValueOnce(mockLibraryData);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the library page with manga cards", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LibraryPage />
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText("One Piece")).toBeInTheDocument();
      expect(screen.getByText("Naruto")).toBeInTheDocument();
    });
  });

  it("navigates to the manga page when a manga card is clicked", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/manga/:mangaId" element={<div>Manga Page</div>} />
          </Routes>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      const mangaCard = screen.getByText("One Piece");
      fireEvent.click(mangaCard);
    });
    expect(screen.getByText("Manga Page")).toBeInTheDocument();
  });

  it("filters the library based on the search term", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <LibraryPage />
        </MemoryRouter>
      );
    });

    await waitFor(async () => {
      const searchInput = screen.getByPlaceholderText(/search library.../i);
      await userEvent.type(searchInput, "one");

      const searchButton = screen.getByTestId("search-button");
      await userEvent.click(searchButton);
    });

    expect(screen.getByText("One Piece")).toBeInTheDocument();
    expect(screen.queryByText("Naruto")).not.toBeInTheDocument();
  });
});
