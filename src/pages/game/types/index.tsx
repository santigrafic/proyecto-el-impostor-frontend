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

export type WordsByPlayerType = {
  nickname: string;
  words: string[];
};

export interface GameStateType {
  roomId: string;
  status: "waiting" | "playing" | "voting" | "finished";
  players: { id: string; nickname: string }[];
  playedWordsCount: number;
  totalPlayers: number;
  words: { word: string }[];
  currentTurn?: string | null;
  wordsPerPlayer?: number;
  wordsByPlayer: WordsByPlayerType[];
  impostorNickname?: "string | null";
  winner: "players" | "impostor";
  votesCount: number;
  votes?: Record<string, string>;
}

export type ResultsType = {
  winner: "impostor" | "players";
  votes: Record<string, number>;
  impostorNickname: string | null;
};

