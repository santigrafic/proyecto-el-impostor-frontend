import { useState } from "react";

import type { VotingPhaseProps } from "./utils/types";
import { playClick01 } from "../../../../commons/utils/soundManager";

import "./VotingPhase.css";

const VotingPhase: React.FC<VotingPhaseProps> = ({ me, gameState, onVote }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const hasAlreadyVoted = me.hasVoted || loading;

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
                  playClick01();
                  setLoading(true);
                  onVote(p.id);
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
