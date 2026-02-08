import React, { useEffect, useState } from "react";
import type { MeType, GameStateType, ResultsType } from "../../types";
import { useNavigate } from "react-router-dom";

type ResultsPhaseProps = {
  me: MeType;
  gameState: GameStateType;
};

async function fetchResults(roomId: string): Promise<ResultsType> {
  const res = await fetch(
    `http://localhost:8000/api/games/${roomId}/results`
  );

  if (!res.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return res.json();
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ me, gameState }) => {
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
    <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1>Resultados de la partida</h1>

      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        {winner === "players"
          ? "¡Los jugadores ganan!"
          : "¡El impostor gana!"}
      </p>

      <h2>Votos:</h2>
      <ul style={{ listStyle: "none", padding: 0, textAlign: "left" }}>
        {gameState.players.map((p) => (
          <li key={p.id}>
            {p.nickname} recibió{" "}
            <strong>{votes[p.id] ?? 0}</strong> votos
          </li>
        ))}
      </ul>

      <p>El impostor era: <strong>{impostorNickname}</strong></p>

      <button
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
        onClick={() => navigate("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
};

export default ResultsPhase;
