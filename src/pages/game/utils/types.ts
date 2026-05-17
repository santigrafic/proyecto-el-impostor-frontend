export type WordsByPlayerType = {
  nickname: string;
  words: string[];
};

export type ResultsType = {
  winner: "impostor" | "players";
  votes: Record<string, number>;
  impostorNickname: string | null;
};