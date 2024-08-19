module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    on: jest.fn(),
    quit: jest.fn(),
    // Add other methods you use in your app
    getPath: jest.fn(),
    whenReady: jest.fn().mockResolvedValue(undefined),
  },
  remote: jest.fn(),
  dialog: jest.fn(),
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadURL: jest.fn(),
    on: jest.fn(),
    show: jest.fn(),
  })),
};
