import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  roomId,
  fetchGameState,
}) => {
  const navigate = useNavigate();
  const hasVoted = me.hasVoted;

  // Polling para comprobar si todos los votos se han registrado
  useEffect(() => {
    if (!hasVoted) return; // solo los que ya han votado hacen polling

    const interval = setInterval(async () => {
      try {
        await fetchGameState();
        if (gameState.status === "finished") {
          clearInterval(interval);
          navigate(`/game/${roomId}/result`);
        }
      } catch (err) {
        console.error("Error fetching game state:", err);
      }
    }, 2000); // cada 2 segundos

    return () => clearInterval(interval);
  }, [hasVoted, fetchGameState, navigate, roomId]);

  return (
    <div className="voting-container">
      <h1 className="voting-title">Fase de votación</h1>

      <p className="voting-status">
        {hasVoted
          ? "Ya has votado. Espera a que los demás jugadores voten."
          : "Quién crees que es el impostor:"}
      </p>

      <div className="voting-list">
        {gameState.players
          .filter((p) => p.id !== me.playerId)
          .map((p) => (
            <button
              key={p.id}
              className="arcade-btn voting-btn"
              disabled={hasVoted}
              onClick={() => onVote(p.id)}
            >
              {p.nickname}
            </button>
          ))}
      </div>
    </div>
  );
};

export default VotingPhase;
