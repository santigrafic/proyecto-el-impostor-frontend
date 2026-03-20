import React, { useEffect, useState } from "react";
import type { MeType, GameStateType, ResultsType } from "../../types";
import { useNavigate } from "react-router-dom";

import "./ResultsPhase.css";

type ResultsPhaseProps = {
  me: MeType;
  gameState: GameStateType;
};

async function fetchResults(roomId: string): Promise<ResultsType> {
  const res = await fetch(`http://localhost:8000/api/games/${roomId}/results`);

  if (!res.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return res.json();
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ gameState }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await fetchResults(gameState.roomId);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [gameState.roomId]);

  if (loading) return <p>Cargando resultados...</p>;
  if (!results) return <p>No se pudieron cargar los resultados</p>;

  const { winner, votes, impostorNickname } = results;

  return (
    <div className="results-container">
      <h1 className="results-title">Resultado de la partida</h1>

      <p className={`results-winner ${winner}`}>
        {winner === "players" ? "¡Los jugadores ganan!" : "¡El impostor gana!"}
      </p>

      <h2 className="results-subtitle">Votos</h2>

      <ul className="results-list">
        {gameState.players.map((p) => (
          <li key={p.id} className="results-item">
            <span className="cursor">&gt;</span> {p.nickname} recibió {votes[p.id] ?? 0} votos
          </li>
        ))}
      </ul>

      <p className="results-impostor">
        El impostor era: {impostorNickname}
      </p>

      <button className="arcade-btn results-btn" onClick={() => navigate("/home")}>
        Volver a inicio
      </button>
    </div>
  );
};

export default ResultsPhase;
