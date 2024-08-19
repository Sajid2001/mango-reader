import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import configureMockStore from "redux-mock-store";
import { Provider } from "react-redux";
import KeybindPopup from "../KeybindPopup";

const mockStore = configureMockStore([]);

// Mock the KeybindSelector component
jest.mock("../KeybindSelector", () => {
  return jest.fn(({ onClose }) => (
    <div data-testid="keybind-selector">
      KeybindSelector <button onClick={onClose}>Close</button>
    </div>
  ));
});

describe("KeybindPopup Component", () => {
  const closeKeybinds = jest.fn();

  let store: any;

  beforeEach(() => {
    // Initialize the mock store with the initial state
    store = mockStore({
      userSettings: {
        leftPageKeybind: "ArrowLeft",
        rightPageKeybind: "ArrowRight",
        leftChapterKeybind: "Ctrl+ArrowLeft",
        rightChapterKeybind: "Ctrl+ArrowRight",
        sidebarKeybind: "S",
        exitKeybind: "Esc",
      },
    });
  });

  it("renders correctly with keybinds", () => {
    render(
      <Provider store={store}>
        <KeybindPopup closeKeybinds={closeKeybinds} />
      </Provider>
    );

    expect(screen.getByText("Move Page Left")).toBeInTheDocument();
    expect(screen.getByText("ArrowLeft")).toBeInTheDocument();

    expect(screen.getByText("Move Page Right")).toBeInTheDocument();
    expect(screen.getByText("ArrowRight")).toBeInTheDocument();

    expect(screen.getByText("Move Chapter Left")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+ArrowLeft")).toBeInTheDocument();

    expect(screen.getByText("Move Chapter Right")).toBeInTheDocument();
    expect(screen.getByText("Ctrl+ArrowRight")).toBeInTheDocument();

    expect(screen.getByText("Open Reader Sidebar")).toBeInTheDocument();
    expect(screen.getByText("S")).toBeInTheDocument();

    expect(screen.getByText("Go Back")).toBeInTheDocument();
    expect(screen.getByText("Esc")).toBeInTheDocument();
  });

  it("opens the KeybindSelector when a keybind button is clicked", async () => {
    render(
      <Provider store={store}>
        <KeybindPopup closeKeybinds={closeKeybinds} />
      </Provider>
    );

    const leftPageKeybindButton = screen.getByText("ArrowLeft");
    await userEvent.click(leftPageKeybindButton);

    // Verify that the KeybindSelector is displayed
    expect(screen.getByTestId("keybind-selector")).toBeInTheDocument();
  });

  it("calls closeKeybinds when the close button is clicked", async () => {
    render(
      <Provider store={store}>
        <KeybindPopup closeKeybinds={closeKeybinds} />
      </Provider>
    );

    const closeButton = screen.getByTestId("close-keybinds-button");
    await userEvent.click(closeButton);

    expect(closeKeybinds).toHaveBeenCalled();
  });

  it("closes the KeybindSelector when onClose is called", async () => {
    render(
      <Provider store={store}>
        <KeybindPopup closeKeybinds={closeKeybinds} />
      </Provider>
    );

    const leftPageKeybindButton = screen.getByText("ArrowLeft");
    await userEvent.click(leftPageKeybindButton);

    expect(screen.getByTestId("keybind-selector")).toBeInTheDocument();

    // Click the close button within the KeybindSelector mock
    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);

    expect(screen.queryByTestId("keybind-selector")).not.toBeInTheDocument();
  });
});
