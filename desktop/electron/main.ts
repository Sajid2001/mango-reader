import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'node:path'
import { getSettings, loadSettings } from '../src/fileStorage/settingsStorage';
import { UserSettings } from '../src/models/userSettings';
import { setAllSettings } from '../src/reduxStorage/settingsSlice';
import { useDispatch } from 'react-redux';
const fs = require('fs');



// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    
    minWidth: 750, // Set minimum width
    minHeight: 300, // Set minimum height
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

ipcMain.on("saveData", (sender, data) => {
  let sData = JSON.stringify(data);
  fs.writeDataToFile("library.json", sData);
});

ipcMain.on("readData", (sender, data) => {
  let sData = JSON.stringify(data);
  fs.writeDataToFile("library.json", sData);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

ipcMain.handle('open-file-dialog', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (result.canceled) {
    return;
  } else {
    const filePath = result.filePaths[0];
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  const dispatch = useDispatch();

  loadSettings().then(() => {
    getSettings().then((oldSettings: UserSettings) => {
      dispatch(setAllSettings(oldSettings));
    })
  }).finally(() => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})



app.whenReady().then(createWindow)
