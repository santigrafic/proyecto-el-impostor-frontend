import React, { useEffect, useState } from "react";
import type { MeType, GameStateType, ResultsType } from "../../types";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../../../../commons/components/loadingScreen/LoadingScreen";

import "./ResultsPhase.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_GAME_API_TOKEN


type ResultsPhaseProps = {
  me: MeType;
  gameState: GameStateType;
  roomId: string;
};

async function fetchResults(roomId: string): Promise<ResultsType> {
  const res = await fetch(`${API_URL}/api/games/${roomId}/results`);

  if (!res.ok) {
    throw new Error("Error obteniendo resultados");
  }

  return res.json();
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ gameState, roomId }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const gameId = gameState?.game_id;


  useEffect(() => {
    async function loadResults() {
      try {
        const data = await fetchResults(roomId);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [gameState.roomId]);

  useEffect(() => {
    if (!results || saved) return;
    if (gameId == null) return;
    const currentResults = results;
    console.log(currentResults);
    async function finishGame() {
      try {
        const res = await fetch(`${API_URL}/api/games/${roomId}/finish`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-GAME-TOKEN": `${API_TOKEN}`,
          },
          body: JSON.stringify({
            winner: currentResults.winner,
            players: gameState.players,
            gameId: gameId
          }),
        });

        console.log("Llega aqui");
        if (!res.ok) {
          const err = await res.json();
          console.error(err);
          return;
        }

        setSaved(true);

      } catch (err) {
        console.error(err);
      }
    }

    finishGame();

  }, [results]);

  if (loading)
    // return <p>Cargando resultados...</p>;
    return <LoadingScreen />;
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
