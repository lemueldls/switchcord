import { app, ipcMain } from "electron";
import axios from "axios";
import DiscordRPC from "discord-rpc";

let games: any;
const gameData: any = {};

app.whenReady().then(async () => {
  const { data } = await axios.get("http://nintenbot.js.org/rpc.json");

  games = data.gameLibrary;

  for (const { name, pic } of games) gameData[pic] = name;
});

ipcMain.handle("games", () => games);

const rpc = new DiscordRPC.Client({ transport: "ipc" });

const clientId = "387406899739623426";

rpc.login({ clientId });

ipcMain.handle(
  "presence",
  (_event, game: string, desc: string, time: boolean) => {
    const name = gameData[game];

    rpc.setActivity({
      state: desc,
      details: name,
      startTimestamp: time ? new Date() : undefined,
      largeImageKey: game,
      largeImageText: name,
      smallImageKey: "switch",
    });
  }
);
