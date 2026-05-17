import type { GameStateType, MeType } from "../../../utils/interfaces";

export type VotingPhaseProps = {
  me: MeType;
  gameState: GameStateType;
  onVote: (targetPlayerId: string) => void;
};