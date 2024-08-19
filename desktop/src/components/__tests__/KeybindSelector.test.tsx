import { render, fireEvent, screen } from "@testing-library/react";
import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import KeybindSelector from "../KeybindSelector";
import { changeKeybind } from "../../reduxStorage/settingsSlice";

const mockStore = configureStore([]);

describe("KeybindSelector", () => {
  let store: any;
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    store = mockStore({
      userSettings: {
        leftChapterKeybind: "ArrowLeft",
        rightChapterKeybind: "ArrowRight",
        leftPageKeybind: "ArrowLeft",
        rightPageKeybind: "ArrowRight",
        sidebarKeybind: "s",
        exitKeybind: "Escape",
      },
    });

    onCloseMock = jest.fn();

    // Clear any actions before each test
    store.clearActions();
  });

  it("should display 'Press any key' initially", () => {
    render(
      <Provider store={store}>
        <KeybindSelector
          keybindToChange="leftChapterKeybind"
          onClose={onCloseMock}
        />
      </Provider>
    );

    expect(screen.getByText(/press any key/i)).toBeInTheDocument();
  });

  it("should display the correct key combination when a key is pressed", () => {
    render(
      <Provider store={store}>
        <KeybindSelector
          keybindToChange="leftChapterKeybind"
          onClose={onCloseMock}
        />
      </Provider>
    );

    const event = new KeyboardEvent("keydown", { key: "a" });
    fireEvent(document, event);

    expect(screen.getByText("a")).toBeInTheDocument();
  });

  it("should dispatch changeKeybind with the correct arguments when approved", () => {
    render(
      <Provider store={store}>
        <KeybindSelector
          keybindToChange="leftChapterKeybind"
          onClose={onCloseMock}
        />
      </Provider>
    );

    const event = new KeyboardEvent("keydown", { key: "a" });
    fireEvent(document, event);

    const approveButton = screen.getByTestId("approve-button");
    fireEvent.click(approveButton);

    const actions = store.getActions();
    expect(actions).toEqual([
      changeKeybind({ key: "a", map: "leftChapterKeybind" }),
    ]);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should call onClose when the cancel button is clicked", () => {
    render(
      <Provider store={store}>
        <KeybindSelector
          keybindToChange="leftChapterKeybind"
          onClose={onCloseMock}
        />
      </Provider>
    );

    const cancelButton = screen.getByTestId("close-button");
    fireEvent.click(cancelButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it("should disable the approve button when no keybind is selected", () => {
    render(
      <Provider store={store}>
        <KeybindSelector
          keybindToChange="leftChapterKeybind"
          onClose={onCloseMock}
        />
      </Provider>
    );

    const approveButton = screen.getByTestId("approve-button");
    expect(approveButton).toBeDisabled();
  });
});
