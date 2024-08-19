import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Sidebar from "../Sidebar";

describe("Sidebar Component", () => {
  it("contains the correct number of anchor tags", () => {
    const expectedNumberOfAnchorTags = 5;

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    // Query all anchor tags within the Sidebar
    const anchorTags = screen.getAllByRole("link");

    // Assert that the number of anchor tags is as expected
    expect(anchorTags.length).toBe(expectedNumberOfAnchorTags);
  });

  it("should have the correct href in the anchor tags", () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    const anchorTags = screen.getAllByRole("link");

    // List of expected buttons and their routes
    const buttons = [
      { routeName: "/" },
      { routeName: "/search" },
      { routeName: "/history" },
      { routeName: "/askai" },
      { routeName: "/settings/general" },
    ];

    anchorTags.forEach((anchorTag, index) => {
      expect(anchorTag.closest("a")).toHaveAttribute(
        "href",
        buttons[index].routeName
      );
    });
  });

  it("should navigate to the correct route when clicked", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Sidebar />
        <Routes>
          <Route path="/" element={<div>Library Page</div>} />
          <Route path="/search" element={<div>Search Page</div>} />
          <Route path="/history" element={<div>History Page</div>} />
          <Route path="/askai" element={<div>Ask AI Page</div>} />
          <Route path="/settings/general" element={<div>Settings Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const routes = [
      { routeName: "/", pageName: "Library Page" },
      { routeName: "/search", pageName: "Search Page" },
      { routeName: "/history", pageName: "History Page" },
      { routeName: "/askai", pageName: "Ask AI Page" },
      { routeName: "/settings/general", pageName: "Settings Page" },
    ];

    const anchorTags = screen.getAllByRole("link");
    anchorTags.forEach((anchorTag, index) => {
      fireEvent.click(anchorTag);

      expect(anchorTag.closest("a")).toHaveAttribute(
        "href",
        routes[index].routeName
      );

      expect(screen.getByText(routes[index].pageName)).toBeInTheDocument();
    });
  });
});
