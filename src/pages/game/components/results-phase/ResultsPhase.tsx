import React from "react";
import type { MeType, GameStateType } from "../../types";

interface ResultsPhaseProps {
  gameState: GameStateType;
  me: MeType;
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ gameState, me }) => {
  return (
    <div>
      <h2>Resultados de la partida</h2>
      <p>El impostor era: {gameState.impostorNickname}</p>
      <p>Ganador: {gameState.winnerNickname}</p>
    </div>
  );
};

export default ResultsPhase;
