import { autoUpdater } from "electron-updater";

// import log from "consola";

// autoUpdater.logger = log;
// // autoUpdater.logger.transports.file.level = "info";
// log.info("App starting...");

// function sendStatusToWindow(text: string) {
//   log.info(text);
// }

// autoUpdater.on("checking-for-update", () => {
//   sendStatusToWindow("Checking for update...");
// });
// autoUpdater.on("update-available", info => {
//   sendStatusToWindow("Update available.");
// });
// autoUpdater.on("update-not-available", info => {
//   sendStatusToWindow("Update not available.");
// });
// autoUpdater.on("error", error => {
//   sendStatusToWindow(`Error in auto-updater. ${error}`);
// });
// autoUpdater.on("download-progress", progressObject => {
//   let message = `Download speed: ${progressObject.bytesPerSecond}`;
//   message = `${message} - Downloaded ${progressObject.percent}%`;
//   message = `${message} (${progressObject.transferred}/${progressObject.total})`;
//   sendStatusToWindow(message);
// });
// autoUpdater.on("update-downloaded", info => {
//   sendStatusToWindow("Update downloaded");
// });

export default autoUpdater;
