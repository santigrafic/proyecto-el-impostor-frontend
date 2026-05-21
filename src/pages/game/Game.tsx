import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VotingPhase from "./components/voting-phase/VotingPhase";
import ResultsPhase from "./components/results-phase/ResultsPhase";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";
import { THEME_LABELS } from "../../application/config/constants";

import { getEcho } from "../../lib/echo";
import { useModal } from "../../commons/context/AlertsModalContext";

import type { GameStateType, MeType } from "./utils/interfaces";

import "./Game.css";

const echo = getEcho();
const API_URL = import.meta.env.VITE_API_URL;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { showAlertsModal } = useModal();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingWord, setLoadingWord] = useState<boolean>(false);
  const [wordSubmitted, setWordSubmitted] = useState<boolean>(false);
  const [loadingVote, setLoadingVote] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [me, setMe] = useState<MeType | null>(null);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  const [wordInput, setWordInput] = useState<string>("");
  const [votingStarted, setVotingStarted] = useState<boolean>(false);

  const playerId = localStorage.getItem("playerId");
  const allWordsPlayed =
    !!gameState &&
    !!me &&
    gameState.playedWordsCount === gameState.totalPlayers * me.wordsPerPlayer;

  (window as any).Echo = echo;

  const currentPlayer = gameState?.players.find(
    (p) => String(p.id) === String(gameState?.currentTurn),
  );

  useEffect(() => {
    fetchInitialData();

    const channel = echo.channel(`room.${roomId}`);

    channel.listen(".game.exit", () => {
      showAlertsModal("ERROR", "Un jugador abandonó la partida");
      navigate(ROUTE_PATHS.HOME);
    });

    channel.listen(".word.played", async (event: any) => {
      setGameState(event.gameState);
      await fetchMe();
    });

    channel.listen(".vote.registered", (event: any) => {
      setGameState(event.gameState);
    });

    channel.listen(".game.finished", (event: any) => {
      setGameState(event.gameState);
    });

    return () => {
      echo.leave(`room.${roomId}`);
    };
  }, []);

  useEffect(() => {
    setWordSubmitted(false);
  }, [me?.isMyTurn]);

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
      const res = await fetch(`${API_URL}/api/games/${roomId}/me`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      });
      if (!res.ok) throw new Error("Error cargando info del jugador");
      const data: MeType = await res.json();
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
      const res = await fetch(`${API_URL}/api/games/${roomId}/state`);
      if (!res.ok) return;
      const data: GameStateType = await res.json();
      if (!data.wordsByPlayer) data.wordsByPlayer = [];
      setGameState(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loadingWord || wordSubmitted) return;

    if (!wordInput.trim()) return;

    setLoadingWord(true);

    try {
      const res = await fetch(`${API_URL}/api/games/${roomId}/word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId,
          word: wordInput.trim(),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        showAlertsModal("ERROR", errData.error);
        
        return;
      }

      setWordInput("");
      setWordSubmitted(true);
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "Error enviando palabra");
    } finally {
      setLoadingWord(false);
    }
  };

  const goToVoting = async () => {
    setLoadingVote(true);
    setVotingStarted(true);

    try {
      const res = await fetch(`${API_URL}/api/games/${roomId}/start-voting`, {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json();
        showAlertsModal("ERROR", errData.error);
        setVotingStarted(false);
        return;
      }

      await fetchGameState();
    } catch (e) {
      console.error("Error al pasar a votación", e);
      setLoadingVote(false);
    }
  };

  const handleVote = async (targetPlayerId: string) => {
    if (!playerId) return;

    try {
      const res = await fetch(`${API_URL}/api/games/${roomId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: playerId,
          votedPlayerId: targetPlayerId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        showAlertsModal("ERROR", errData.error);
        return;
      }

      await fetchMe();
      await fetchGameState();
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "Error enviando voto");
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) return <p>Error: {error}</p>;
  if (!me || !gameState) return;

  if (gameState.status === "playing") {
    return (
      <div className="container">
        <div className="game-container">
          <h1 className="game-title">Partida {roomId}</h1>

          <section className="top-info">
            <p>
              <span>\\</span>Rol:{" "}
              <span className={`role ${me.role}`}>{me.role}</span>
            </p>
            {me.role === "player" ? (
              <p>
                <span>\\</span>Palabra: {me.word}
              </p>
            ) : (
              <p>
                <span>\\</span>Palabra: ---
              </p>
            )}
            <p>
              <span>\\</span>Tema: {THEME_LABELS[gameState.theme]}
            </p>
          </section>

          <section className="game-section">
            <h2 className="game-subtitle">INFO JUGADOR</h2>
            <p>
              <span>&gt;</span> Nickname: {me.nickname}
            </p>
          </section>

          <section className="game-section">
            <h2 className="game-subtitle">INFO PARTIDA</h2>
            {me.hasPlayed && (
              <p className="status-ok">
                <span>&gt;</span> Ya has jugado todas tus palabras
              </p>
            )}
            <p>
              <span>&gt;</span> Tus palabras: {me.words.length} /{" "}
              {me.wordsPerPlayer}
            </p>
            {currentPlayer && (
              <p>
                <span className="blink">&gt;</span> Turno de:{" "}
                {currentPlayer.nickname}
              </p>
            )}
          </section>

          <section className="game-section">
            <h2 className="game-subtitle">PALABRAS JUGADAS</h2>
            {gameState.wordsByPlayer.length === 0 ? (
              <p className="muted">Aún no hay palabras</p>
            ) : (
              <ul className="words-list">
                {gameState.wordsByPlayer.map((p, index) => (
                  <li key={index} className="word-item">
                    <span>&gt;</span> {p.nickname}:{" "}
                    {p.words.length > 0 ? p.words.join(", ") : "—"}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {me.isMyTurn && !me.hasPlayed && !wordSubmitted && (
            <section className="game-section">
              <h2 className="game-subtitle">
                <span className="blink">ES TU TURNO:</span>
              </h2>
              {loadingWord ? (
                <p className="sending-text">ENVIANDO PALABRA...</p>
              ) : (
                <form className="word-form" onSubmit={handleSubmit}>
                  <input
                    className="arcade-input"
                    type="text"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                    minLength={2}
                    maxLength={15}
                    required
                    placeholder="Tu palabra"
                  />
                  <button type="submit" className="arcade-btn">
                    Enviar
                  </button>
                </form>
              )}
            </section>
          )}

          {allWordsPlayed && (
            <div className="center">
              {loadingVote ? (
                <p className="loading-text">CARGANDO...</p>
              ) : (
                <button
                  className="arcade-btn"
                  onClick={goToVoting}
                  disabled={votingStarted}
                >
                  Ir a votación
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState.status === "voting") {
    return <VotingPhase me={me} gameState={gameState} onVote={handleVote} />;
  }

  if (gameState.status === "finished") {
    return <ResultsPhase me={me} gameState={gameState} roomId={roomId!} />;
  }
};

export default GamePage;
