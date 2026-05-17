import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VotingPhase from "./components/voting-phase/VotingPhase";
import ResultsPhase from "./components/results-phase/ResultsPhase";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

import { getEcho } from "../../lib/echo";
const echo = getEcho();

import "./Game.css";

import type { MeType, GameStateType } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

const GamePage: React.FC = () => {
  const { roomId } = useParams();
  const playerId = localStorage.getItem("playerId");

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [loadingWord, setLoadingWord] = useState(false);
  const [wordSubmitted, setWordSubmitted] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [me, setMe] = useState<MeType | null>(null);
  const [gameState, setGameState] = useState<GameStateType | null>(null);
  //console.log("gameState: ", gameState);
  const [wordInput, setWordInput] = useState("");

  const [votingStarted, setVotingStarted] = useState(false);

  const allWordsPlayed =
    !!gameState &&
    !!me &&
    gameState.playedWordsCount === gameState.totalPlayers * me.wordsPerPlayer;

  (window as any).Echo = echo;

  const themeLabels: Record<string, string> = {
    default: "General",
    animals: "Animales",
    movies: "Películas",
    movies80s: "Películas 80s",
    movies90s: "Películas 90s",
    series: "Series",
    harrypotter: "Harry Potter",
    simpsons: "The Simpsons",
  };

  const currentPlayer = gameState?.players.find(
    (p) => String(p.id) === String(gameState?.currentTurn)
  );

  //const [timeLeft, setTimeLeft] = useState(15);

  // Fetch inicial
  useEffect(() => {
    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Carga inicial
    // fetchGameState();
    // fetchMe();

    //EVENTOS
    const channel = echo.channel(`room.${roomId}`);
    //const channel = echo.join(`room.${roomId}`);

    channel.listen(".game.exit", (event: any) => {
      console.log("A PLAYER EXITS", event);
      // setGameState(event.gameState);
      // Actualizar también la información privada del jugador
      // fetchMe();
      alert("Un jugador abandonó la partida");
      navigate("/home");
    });

    channel.listen(".word.played", async (event: any) => {
      console.log("WORD PLAYED", event);
      setGameState(event.gameState);
      // setMe(event.me);
      // Actualizar también la información privada del jugador
      await fetchMe();
    });

    channel.listen(".vote.registered", (event: any) => {
      console.log("VOTE REGISTERED", event);

      setGameState(event.gameState);
    });

    channel.listen(".game.finished", (event: any) => {
      console.log("GAME FINISHED", event);

      setGameState(event.gameState);
      //navigate(`/results/${roomId}`);
    });

    return () => {
      echo.leave(`room.${roomId}`);
    };
  }, [roomId, navigate]);

  /*useEffect(() => {
    if (!gameState || !me) return;
    const allWordsPlayed =
      gameState.playedWordsCount === gameState.totalPlayers * me.wordsPerPlayer;

    if (allWordsPlayed && pollingRef.current !== null) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, [gameState]);*/

  useEffect(() => {
    if (!gameState) return;

    /*if (gameState.status === "finished") {
      finishGame();
    }*/
  }, [gameState?.status]);

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

  /*useEffect(() => {
  if (!me?.isMyTurn || me.hasPlayed) return;

  setTimeLeft(20);

  const interval = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }

      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [me?.isMyTurn]);

useEffect(() => {
  if (timeLeft !== 0) return;
  if (!me?.isMyTurn) return;
  if (me.hasPlayed) return;

  sendAutomaticWord();
}, [timeLeft]);*/

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
      console.log("game_id:", data.game_id);
      console.log("theme:", data.theme);
      console.log("turno de:", data.currentTurn);
      // Asegurarse de que playedWords exista
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

    //setTimeLeft(0);

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
        alert(errData.error || "Error al enviar palabra");
        return;
      }

      setWordInput("");
      setWordSubmitted(true);
      // await fetchMe();
      // await fetchGameState();
    } catch (err) {
      console.error(err);
      alert("Error enviando palabra");
    } finally {
      setLoadingWord(false);
    }
  };

  /*const sendAutomaticWord = async () => {
  try {
    await fetch(`${API_URL}/api/games/${roomId}/word`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerId,
        word: "---",
      }),
    });
  } catch (err) {
    console.error("Error enviando palabra automática", err);
  }
};*/

  const goToVoting = async () => {

    if (loadingVote) return;
    setLoadingVote(true);

    if (votingStarted) return;
    setVotingStarted(true);

    try {
      const res = await fetch(`${API_URL}/api/games/${roomId}/start-voting`, {
        method: "POST",
      });
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Error al iniciar votación");
        setVotingStarted(false);
        return;
      }

      // Aquí hacemos fetch del estado actualizado del juego
      await fetchGameState();
    } catch (e) {
      console.error("Error al pasar a votación", e);
    } finally {
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
        alert(errData.error || "Error al enviar voto");
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

  const handleExitGame = async () => {
    const confirmExit = window.confirm(
      "¿Seguro que quieres salir? La partida termina aquí.",
    );

    if (!confirmExit) return;

    try {
      const socketId = (window as any).Echo?.socketId();
      const res = await fetch(`${API_URL}/api/games/${roomId}/exit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Socket-Id": socketId,
        },
        body: JSON.stringify({
          roomId,
          playerId,
        }),
      });

      const data = await res.json();

      console.log("EXIT RESPONSE:", data);

      navigate("/home");
    } catch (error) {
      console.error("Error exiting game:", error);
    }
  };

  /*const finishGame = async () => {
    if (!gameId) return;
    try {
      console.log(gameState);
      const res = await fetch(`${API_URL}/api/games/${roomId}/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-GAME-TOKEN": import.meta.env.VITE_GAME_API_TOKEN,
        },
        body: JSON.stringify({
          winner: gameState.winner,
          players: gameState.players,
        }),
      });

      if (!res.ok) {
        console.error("Error guardando partida");
      }
    } catch (err) {
      console.error("Error finish game:", err);
    }
  };*/

  // if (loading) return <p>Cargando partida...</p>;
  if (loading) {
    return <LoadingScreen />;
  }
  if (error) return <p>Error: {error}</p>;
  if (!me || !gameState) return;
  //<p>Cargando datos...</p>;
  <LoadingScreen />;

  if (gameState.status === "playing") {
    return (
      <div className="container">
        {/*<section className="game-header">
          <button className="btn-exit-game" onClick={handleExitGame}>
            <span className="cursor">&lt;</span>Salir
          </button>
        </section>*/}
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
              <span>\\</span>Tema: {themeLabels[gameState.theme]}
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
            <p className="status-ok"><span>&gt;</span> Ya has jugado todas tus palabras</p>
          )}
          <p>
            <span>&gt;</span> Tus palabras: {me.words.length}{" "}
            / {me.wordsPerPlayer}
          </p>
          {currentPlayer && (
            <p><span className="blink">&gt;</span> Turno de: {currentPlayer.nickname}</p>
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
            <h2 className="game-subtitle"><span className="blink">ES TU TURNO:</span></h2>
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
                  placeholder={
                    me.role === "impostor"
                      ? "Confúndeles"
                      : "Tu palabra"
                  }
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
    return (
      <VotingPhase
        me={me}
        gameState={gameState}
        onVote={handleVote}
        roomId={roomId!}
        fetchGameState={fetchGameState}
      />
    );
  }

  if (gameState.status === "finished") {
    return <ResultsPhase me={me} gameState={gameState} roomId={roomId!} />;
  }
};

export default GamePage;
