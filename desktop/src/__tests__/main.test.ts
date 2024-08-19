import { app } from "electron";

jest.mock("electron");

describe("Electron app", () => {
  it("should be defined", () => {
    expect(app).toBeDefined();
  });

  it('should have an "on" method', () => {
    expect(app.on).toBeDefined();
  });

  it('should have a "quit" method', () => {
    expect(app.quit).toBeDefined();
  });
});
