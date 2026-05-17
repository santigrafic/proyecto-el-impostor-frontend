import type { WordsByPlayerType } from "./types";

export interface MeType {
  playerId: string;
  nickname: string;
  role: "player" | "impostor";
  word: string | null;
  words: string[];
  wordsPerPlayer: number;
  currentTurn: string | null;
  hasPlayed: boolean;
  isMyTurn: boolean;
  hasVoted: boolean;
}

export interface GameStateType {
  roomId: string;
  status: "waiting" | "playing" | "voting" | "finished";
  game_id: number | null;
  players: { id: string; nickname: string }[];
  hostId: { id: string };
  playedWordsCount: number;
  totalPlayers: number;
  words: { word: string }[];
  theme: string;
  currentTurn?: string | null;
  wordsPerPlayer?: number;
  wordsByPlayer: WordsByPlayerType[];
  impostorNickname?: string | null;
  winner: "players" | "impostor";
  votesCount: number;
  votes?: Record<string, string>;
}