import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MangaCard from "../MangaCard";

describe("MangaCard component", () => {
  it("renders card information correctly", () => {
    const mangaCardTestProps = {
      mangaId: 1,
      title: "Bleach",
      image: "https://example.com/image.jpg",
      chapters: 1200,
    };
    render(
      <MemoryRouter>
        <MangaCard {...mangaCardTestProps} />
      </MemoryRouter>
    );

    // Hover over the MangaCard
    const cardElement = screen.getByAltText("cover image");
    fireEvent.mouseOver(cardElement);

    // Check if the chapter count is rendered correctly
    const chapterCountText = screen.getByText(/1K+/i);
    expect(chapterCountText).toBeInTheDocument();
  });

  it("renders the exact chapter count when less than 1000", () => {
    // Mock Props with fewer chapters
    const mangaCardTestProps = {
      mangaId: 1,
      title: "Bleach",
      image: "https://example.com/image.jpg",
      chapters: 500,
    };

    render(
      <MemoryRouter>
        <MangaCard {...mangaCardTestProps} />
      </MemoryRouter>
    );

    // Hover over the MangaCard
    const cardElement = screen.getByAltText("cover image");
    fireEvent.mouseOver(cardElement);

    // Check if the exact chapter count is rendered correctly
    const chapterCountText = screen.getByText(/500/i);
    expect(chapterCountText).toBeInTheDocument();
  });

  it("navigates to the correct route when clicked", () => {
    const mangaCardTestProps = {
      mangaId: 1,
      title: "Bleach",
      image: "https://example.com/image.jpg",
      chapters: 1200,
    };
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<MangaCard {...mangaCardTestProps} />} />
          <Route path="/manga/:mangaId" element={<div>Manga Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Simulate clicking the link
    const cardElement = screen.getByAltText("cover image");
    fireEvent.click(cardElement);

    // Verify that the navigation happened
    expect(screen.getByText(/manga page/i)).toBeInTheDocument();
  });
});
