import { app, BrowserWindow } from "electron";

import "./ipc";
import updater from "./updater";

async function loadDevtools({ webContents }: BrowserWindow) {
  webContents.openDevTools();

  // !! Vue.js Devtools work but causes warnings in the terminal.

  // const {
  //   default: installExtension,
  //   VUEJS_DEVTOOLS,
  // } = require("electron-devtools-installer");

  // await installExtension(VUEJS_DEVTOOLS).catch(error =>
  //   console.error("An error occurred installing Vue.js devtools:", error)
  // );
}

function createWindow() {
  const icon = `resources/icon.${process.platform === "win32" ? "ico" : "png"}`;

  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // Allow loading modules via the `require()` function
      contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
    },
    icon,
  });

  win.setMenu(null);

  if (process.env.NODE_ENV === "production")
    win.loadFile("renderer/dist/index.html");
  else {
    win.loadURL("http://localhost:3000");

    loadDevtools(win);
  }

  updater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
