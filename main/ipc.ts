import { app, ipcMain } from "electron";
import axios from "axios";
import DiscordRPC from "discord-rpc";

import games from "./games.json";

import type { GameData, Game, GameKeys } from "./game";

let gameData: GameData[] = [];

ipcMain.handle("games", async () => {
  const { data } = await axios.get<Game[]>(
    "https://discord.com/api/v9/oauth2/applications/846855871064834059/assets"
  );

  gameData = data
    .filter(({ name }) => games[name])
    .map(({ id, name: img }) => ({
      id,
      img,
      name: games[img].replace("é", "e"),
    }))
    .sort(({ name: a }, { name: b }) => a.localeCompare(b));

  return Object.values(gameData);
});

const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.login({ clientId: "846855871064834059" });

let previous: string;
let time: number;

ipcMain.on(
  "presence",
  (
    _event,
    game: GameKeys | undefined,
    desc: string | undefined,
    showTime: boolean,
    status: string | undefined
  ) => {
    const name = games[game!] || "Nintendo Switch";

    time = !showTime || game !== previous ? Date.now() : time;

    rpc.setActivity({
      details: name,
      state: desc || undefined,
      startTimestamp: showTime ? time : undefined,
      largeImageKey: game || "switch",
      largeImageText: name,
      smallImageKey: status?.toLowerCase() || undefined,
      smallImageText: status || undefined,
    });

    previous = game || "";
  }
);

ipcMain.on("clear", () => rpc.clearActivity());
