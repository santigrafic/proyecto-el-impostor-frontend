export interface Player {
  id: string;
  nickname: string;
}

export interface RoomState {
  hostId: string;
  players: Player[];
  status: "waiting" | "playing";
}