import React from "react";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import type { MeType, GameStateType } from "../../types";

import "./VotingPhase.css";

type VotingPhaseProps = {
  me: MeType;
  gameState: GameStateType;
  onVote: (targetPlayerId: string) => void;
  roomId: string;
  fetchGameState: () => Promise<void>;
};

const VotingPhase: React.FC<VotingPhaseProps> = ({
  me,
  gameState,
  onVote,
  // roomId,
  // fetchGameState,
}) => {
  // const navigate = useNavigate();
  const hasVoted = me.hasVoted;
  const [loading, setLoading] = useState(false);
  const hasAlreadyVoted = hasVoted || loading;

  return (
    <div className="voting-container">
      <h1 className="voting-title">Fase de votación</h1>

      <p className="voting-status">
        {hasAlreadyVoted
          ? "Ya has votado. Espera a que los demás jugadores voten."
          : "Quién crees que es el impostor:"}
      </p>

      {!hasAlreadyVoted && (
        <div className="voting-list">
          {gameState.players
            .filter((p) => p.id !== me.playerId)
            .map((p) => (
              <button
                key={p.id}
                className="arcade-btn voting-btn"
                onClick={async () => {
                  setLoading(true);
                  await onVote(p.id);
                }}
              >
                {p.nickname}
              </button>
            ))}
        </div>
      )}
    </div>
  );
};

export default VotingPhase;
