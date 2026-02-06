import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import VotingPhase from "./components/voting-phase/VotingPhase";
import ResultsPhase from "./components/results-phase/ResultsPhase";

import type { MeType, GameStateType } from "./types";

const GamePage: React.FC = () => {
  const { roomId } = useParams();
  const playerId = localStorage.getItem("playerId");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [me, setMe] = useState<MeType | null>(null);
  const [gameState, setGameState] = useState<GameStateType | null>(null);

  const [wordInput, setWordInput] = useState("");

  // Fetch inicial
  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Polling seguro
  useEffect(() => {
    const interval = setInterval(() => {
      fetchGameState();
      fetchMe(); // refrescar también info privada
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([fetchMe(), fetchGameState()]);
      setLoading(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Error desconocido");
      } else {
        setError(String(err));
      }
    }
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/games/${roomId}/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
      if (!res.ok) throw new Error("Error cargando info del jugador");
      const data: MeType = await res.json();
      // Aquí calculamos hasPlayed
      data.hasPlayed =
        (data.words?.length || 0) >= (gameState?.wordsPerPlayer ?? 3);
      setMe(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const fetchGameState = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/games/${roomId}/state`,
      );
      if (!res.ok) return;
      const data: GameStateType = await res.json();
      // Asegurarse de que playedWords exista
      if (!data.words) data.words = [];
      setGameState(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!wordInput.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/games/${roomId}/word`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            word: wordInput.trim(),
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Error al enviar palabra");
        return;
      }

      setWordInput("");
      await fetchMe();
      await fetchGameState();
    } catch (err) {
      console.error(err);
      alert("Error enviando palabra");
    }
  };

  const handleVote = async (targetPlayerId: string) => {
    if (!playerId) return;

    try {
      const res = await fetch(
        `http://localhost:8000/api/games/${roomId}/vote`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            targetId: targetPlayerId,
          }),
        },
      );

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Error enviando voto");
        return;
      }

      // Actualizamos estado tras votar
      await fetchMe();
      await fetchGameState();
    } catch (err) {
      console.error(err);
      alert("Error enviando voto");
    }
  };

  if (loading) return <p>Cargando partida...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!me || !gameState) return <p>Cargando datos...</p>;

  if (gameState.status === "playing") {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1>Partida {roomId}</h1>

        {/* Info privada */}
        <section>
          <h2>Tu información</h2>
          <p>Nickname: {me.nickname}</p>
          <p>Rol: {me.role}</p>
          {me.role === "player" ? (
            <p>
              <strong>Tu palabra:</strong> {me.word}
            </p>
          ) : (
            <p>
              <strong>No tienes palabra</strong>
            </p>
          )}
          {me.hasPlayed && <p>Ya has jugado tu palabra ✅</p>}
        </section>

        {/* Estado global */}
        <section>
          <h2>Estado de la partida</h2>
          <p>
            Palabras jugadas: {gameState.playedWordsCount} /{" "}
            {gameState.totalPlayers}
          </p>
        </section>

        {/* Listado de palabras */}
        <section>
          <h2>Palabras jugadas</h2>
          {gameState.words.length === 0 ? (
            <p>Aún no hay palabras</p>
          ) : (
            <ul>
              {gameState.words.map((w, index) => (
                <li key={index}>{w.word}</li>
              ))}
            </ul>
          )}
        </section>

        {/* Input */}
        {me.isMyTurn && !me.hasPlayed && (
          <section>
            <h2>Es tu turno</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                maxLength={100}
                required
                placeholder={
                  me.role === "impostor"
                    ? "Escribe algo para confundir..."
                    : "Tu palabra"
                }
              />
              <button type="submit">Enviar</button>
            </form>
          </section>
        )}
      </div>
    );
  }

  if (gameState.status === "voting") {
    return <VotingPhase me={me} gameState={gameState} onVote={handleVote} />;
  }

  if (gameState.status === "finished") {
    return <ResultsPhase me={me} gameState={gameState} />;
  }
};

export default GamePage;
