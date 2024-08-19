import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import SidebarButton from "../SidebarButton";

// Mock Tooltip component
jest.mock("../Tooltip", () => ({ text, children }: any) => (
  <div data-testid="tooltip" data-text={text}>
    {children}
  </div>
));

describe("SidebarButton Component", () => {
  const routeName = "/search";
  const pageName = "Search";
  const icon = <div>Icon</div>;

  const renderWithRouter = (initialEntries = ["/"]) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route
            path="*"
            element={
              <SidebarButton
                icon={icon}
                routeName={routeName}
                pageName={pageName}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    );
  };

  it("renders the component with correct icon and page name", () => {
    renderWithRouter();

    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toHaveAttribute(
      "data-text",
      pageName
    );
  });

  it("applies active classes when route matches location.pathname exactly", () => {
    const { container } = renderWithRouter([routeName]);

    const divElement = container.querySelector(
      ".transition.ease-in-out.duration-200.font-thin.w-14.h-14"
    );

    expect(divElement).toHaveClass("bg-background shadow-inner bg-opacity-70");
  });

  test("applies hover classes when route does not match location.pathname", () => {
    const routeName = "/non-matching-route";

    const { container } = render(
      <MemoryRouter initialEntries={["/different-route"]}>
        <SidebarButton
          icon={<div>Icon</div>}
          routeName={routeName}
          pageName="Library"
        />
      </MemoryRouter>
    );

    // Targeting the div with transition and ease-in-out classes
    const divElement = container.querySelector(
      ".transition.ease-in-out.duration-200.font-thin.w-14.h-14"
    );

    // Check that hover classes are applied
    expect(divElement).not.toHaveClass(
      "bg-background",
      "shadow-inner",
      "bg-opacity-70"
    );
    expect(divElement).toHaveClass("hover:bg-background", "hover:shadow-inner");
  });

  it("applies active classes when on settings route and pathname includes routeName", () => {
    const settingsRoute = "/settings/general";
    renderWithRouter([settingsRoute]);

    const settingsButton = (
      <SidebarButton icon={icon} routeName="/settings" pageName="Settings" />
    );

    const { container } = render(
      <MemoryRouter initialEntries={[settingsRoute]}>
        <Routes>
          <Route path="*" element={settingsButton} />
        </Routes>
      </MemoryRouter>
    );

    const divElement = container.querySelector(
      ".transition.ease-in-out.duration-200.font-thin.w-14.h-14"
    );
    expect(divElement).toHaveClass("bg-background shadow-inner bg-opacity-70");
  });

  it("navigates to the correct route when clicked", () => {
    renderWithRouter();

    const button = screen.getByRole("link");
    userEvent.click(button);

    expect(button).toHaveAttribute("href", routeName);
  });
});
