import { app, BrowserWindow } from "electron";

import "./ipc";

import { autoUpdater } from "electron-updater";
import log from "consola";

autoUpdater.logger = log;
// autoUpdater.logger.transports.file.level = "info";
log.info("App starting...");

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

let win: BrowserWindow;

function createWindow() {
  const isProduction = process.env.NODE_ENV === "production";

  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      // webSecurity: isProduction, // Disable on dev to allow loading local resources
      nodeIntegration: true, // Allow loading modules via the `require()` function
      contextIsolation: false, // https://github.com/electron/electron/issues/18037#issuecomment-806320028
    },
    icon: "resources/icon.ico",
  });

  win.setMenu(null);

  if (isProduction) win.loadFile("renderer/dist/index.html");
  else {
    win.loadURL("http://localhost:3000");

    loadDevtools(win);
  }

  autoUpdater.checkForUpdatesAndNotify();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

function sendStatusToWindow(text: string) {
  log.info(text);
  win.webContents.send("message", text);
}

autoUpdater.on("checking-for-update", () => {
  sendStatusToWindow("Checking for update...");
});
autoUpdater.on("update-available", info => {
  sendStatusToWindow("Update available.");
});
autoUpdater.on("update-not-available", info => {
  sendStatusToWindow("Update not available.");
});
autoUpdater.on("error", error => {
  sendStatusToWindow(`Error in auto-updater. ${error}`);
});
autoUpdater.on("download-progress", progressObject => {
  let message = `Download speed: ${progressObject.bytesPerSecond}`;
  message = `${message} - Downloaded ${progressObject.percent}%`;
  message = `${message} (${progressObject.transferred}/${progressObject.total})`;
  sendStatusToWindow(message);
});
autoUpdater.on("update-downloaded", info => {
  sendStatusToWindow("Update downloaded");
});
