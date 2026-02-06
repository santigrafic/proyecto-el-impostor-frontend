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
}

export interface GameStateType {
  status: "waiting" | "playing" | "voting" | "finished";
  players: { id: string; nickname: string }[];
  playedWordsCount: number;
  totalPlayers: number;
  words: { word: string }[];
  currentTurn?: string | null;
  wordsPerPlayer?: number;
  impostorNickname?: string | null;
  winnerNickname?: string | null;
}
