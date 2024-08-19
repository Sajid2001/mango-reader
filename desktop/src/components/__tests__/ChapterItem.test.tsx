import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ChapterItem from "../ChapterItem";

const chapterItemTestProps = {
  mangaId: 1,
  chapter: {
    mangaId: 1,
    chapterName: "Hello, Alice!",
    chapterNumber: 1,
  },
};
describe("ChapterItem component", () => {
  it("renders chapter information correctly", () => {
    render(
      <MemoryRouter>
        <ChapterItem {...chapterItemTestProps} />
      </MemoryRouter>
    );

    expect(screen.getByText(/Hello, Alice!/i)).toBeInTheDocument();
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });

  it("navigates to the correct route when clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<ChapterItem {...chapterItemTestProps} />} />
          <Route
            path="/reader/:mangaId/:chapterNumber"
            element={<div>Chapter Reader Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    // Simulate clicking the link
    fireEvent.click(screen.getByText(/Hello, Alice!/i));

    // Verify that the navigation happened
    expect(screen.getByText(/Chapter Reader Page/i)).toBeInTheDocument();
  });
});
