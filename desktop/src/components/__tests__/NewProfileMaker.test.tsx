import configureStore from "redux-mock-store";
import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NewProfileMaker from "../NewProfileMaker";
import { addProfile } from "../../reduxStorage/settingsSlice";

// Create a mock store
const mockStore = configureStore([]);

const newProfileMakerTestProps = {
  profileNames: ["Profile 1", "Profile 2"],
  closePopup: jest.fn(),
};

describe("NewProfileMaker Component", () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      userSettings: {
        profiles: ["Profile 1", "Profile 2"],
      },
    });
    store.clearActions();
  });

  it("renders correctly", () => {
    render(
      <Provider store={store}>
        <NewProfileMaker {...newProfileMakerTestProps} />
      </Provider>
    );
    expect(screen.getByText("New Profile")).toBeInTheDocument();
  });

  it("creates a new profile when the button is clicked", async () => {
    render(
      <Provider store={store}>
        <NewProfileMaker {...newProfileMakerTestProps} />
      </Provider>
    );
    const profileInput = screen.getByPlaceholderText(/enter profile name/i);
    const submitButton = screen.getByRole("button", { name: /submit/i });

    await userEvent.type(profileInput, "test");
    screen.debug();
    expect(profileInput).toHaveValue("test");
    await userEvent.click(submitButton);

    // Check if the addProfile action was dispatched
    const actions = store.getActions();
    console.log(actions);
    expect(actions).toContainEqual(addProfile("test"));

    // Check if closePopup was called
    expect(newProfileMakerTestProps.closePopup).toHaveBeenCalled();
  });
});
