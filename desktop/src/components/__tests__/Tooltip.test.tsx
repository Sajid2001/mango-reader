import { render, screen, fireEvent } from "@testing-library/react";
import Tooltip from "../Tooltip";

describe("Tooltip Component", () => {
  it("renders the text correctly", () => {
    const text = "Tooltip text";
    render(
      <Tooltip text={text}>
        <div>Tooltip content</div>
      </Tooltip>
    );

    const div = screen.getByText("Tooltip content");
    fireEvent.mouseOver(div);
    expect(screen.getByText(text)).toBeInTheDocument();
  });
});
