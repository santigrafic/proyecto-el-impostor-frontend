import React from "react";
import type { MeType, GameStateType } from "../../types";

interface VotingPhaseProps {
  gameState: GameStateType;
  me: MeType;
  onVote: (playerId: string) => void;
}

const VotingPhase: React.FC<VotingPhaseProps> = ({ gameState, me, onVote }) => {
  return (
    <div>
      <h2>Fase de votación</h2>
      <p>Elige a quién crees que es el impostor:</p>
      <ul>
        {gameState.players
          .filter((p) => p.id !== me.playerId) // no puedes votarte a ti
          .map((p) => (
            <li key={p.id}>
              {p.nickname} <button onClick={() => onVote(p.id)}>Votar</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default VotingPhase;
