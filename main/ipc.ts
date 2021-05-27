import { app, ipcMain } from "electron";
import axios from "axios";
import DiscordRPC from "discord-rpc";

import games from "./games.json";

import type { GameData, Game, GameKeys } from "./game";

let gameData: GameData[] = [];

app.whenReady().then(async () => {
  const { data } = await axios.get<Game[]>(
    "https://discord.com/api/v9/oauth2/applications/846855871064834059/assets"
  );

  gameData = data
    .filter(({ name }) => games[name])
    .map(({ id, name: img }) => ({ id, img, name: games[img] }));
});

ipcMain.handle("games", () => Object.values(gameData));

const rpc = new DiscordRPC.Client({ transport: "ipc" });

rpc.login({ clientId: "846855871064834059" });

ipcMain.on(
  "presence",
  async (
    _event,
    game: GameKeys | undefined,
    desc: string | undefined,
    time: boolean,
    status: string | undefined
  ) => {
    const name = games[game!] || "Nintendo Switch";

    await rpc.setActivity({
      details: name,
      state: desc || undefined,
      startTimestamp: time ? Date.now() : undefined,
      largeImageKey: game || "switch",
      largeImageText: name,
      smallImageKey: status?.toLowerCase() || undefined,
      smallImageText: status || undefined,
    });
  }
);

ipcMain.on("clear", () => rpc.clearActivity());
