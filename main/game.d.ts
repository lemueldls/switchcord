import games from "./games.json";

export type GameKeys = keyof typeof games;

export interface Game {
  id: string;
  name: GameKeys;
}

export interface GameData {
  id: string;
  name: string;
  img: GameKeys;
}
