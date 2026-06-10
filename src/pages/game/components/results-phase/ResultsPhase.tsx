import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../../../../commons/components/loadingScreen/LoadingScreen";

import type { ResultsPhaseProps } from "./utils/types";
import type { ResultsType } from "../../utils/types";
import { playClick01, resultsAudio, stopGameMusic } from "../../../../commons/utils/soundManager";

import { ROUTE_PATHS } from "../../../../application/components/routes/utils/route-paths";

import "./ResultsPhase.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_GAME_API_TOKEN;

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ gameState, roomId }) => {
  const navigate = useNavigate();

  const [results, setResults] = useState<ResultsType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const game_id = gameState?.game_id;

  const fetchResults = async (roomId: string) => {
    const res = await fetch(`${API_URL}/api/games/${roomId}/results`);

    if (!res.ok) {
      throw new Error("Error obteniendo resultados");
    }

    return res.json();
  };

  const loadResults = async () => {
    try {
      const data = await fetchResults(roomId);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const finishGame = async () => {
    try {
      const res = await fetch(`${API_URL}/api/games/${roomId}/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-GAME-TOKEN": `${API_TOKEN}`,
        },
        body: JSON.stringify({
          winner: results?.winner,
          players: gameState.players,
          game_id: game_id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadResults();
    resultsAudio();
  }, []);

  useEffect(() => {
    if (!results) return;

    finishGame();
    localStorage.removeItem('roomId');
  }, [results]);

  if (loading) return <LoadingScreen />;

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
            <span className="cursor">&gt;</span> {p.nickname} recibió{" "}
            {votes[p.id] ?? 0} votos
          </li>
        ))}
      </ul>

      <p className="results-impostor">El impostor era: {impostorNickname}</p>

      <button
        className="arcade-btn results-btn"
        onClick={() => { stopGameMusic(); playClick01(); navigate(ROUTE_PATHS.HOME)}}
      >
        Volver a inicio
      </button>
    </div>
  );
};

export default ResultsPhase;
