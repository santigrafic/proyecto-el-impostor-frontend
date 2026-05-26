import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";
import CopyRoomCode from "../../commons/components/copyRoomCode";
import Button from "../../commons/components/presentational/button";


import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

import { useModal } from "../../commons/context/AlertsModalContext";
import { getEcho } from "../../lib/echo";

import type { RoomState } from "./utils/interfaces";

import "./Room.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_GAME_API_TOKEN;
const echo = getEcho();

const RoomPage: React.FC = () => {
  const navigate = useNavigate();

  const { roomId } = useParams<{ roomId: string }>();

  const [room, setRoom] = useState<RoomState | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [theme, setTheme] = useState<string>("default");
  const [wordsPerPlayer, setWordsPerPlayer] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const { showAlertsModal } = useModal();

  const playerId = localStorage.getItem("playerId");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isPremium = currentUser?.isPremium;

  useEffect(() => {
    fetchRoomState();

    const channel = echo.channel(`room.${roomId}`);

    // Player joined
    channel.listen(".player.joined", (event: any) => {
      setRoom(event.room);
      setIsHost(playerId === event.room.hostId);
    });

    // Player exits
    channel.listen(".room.exit", (event: any) => {
      setRoom(event.room);
    });

    // Host exits
    channel.listen(".room.closed", () => {
      showAlertsModal("ERROR", "El host abandonó la partida. La sala se ha cerrado");
      navigate(ROUTE_PATHS.HOME);
    });

    // Game started
    channel.listen(".game.started", () => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      echo.leave(`room.${roomId}`);
    };
  }, []);

  const fetchRoomState = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/state`);
      if (!res.ok) throw new Error("Error al obtener estado de la sala");

      const data = await res.json();

      setRoom(data);
      setIsHost(playerId === data.hostId);

      if (data.status === "playing") {
        navigate(`/game/${roomId}`);
      }
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "No se pudo cargar la sala");
    }
  };

  const handleExitSubscription = async () => {
    const socketId = echo.socketId();

    await fetch(`${API_URL}/api/rooms/${roomId}/exit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({ playerId }),
    });

    navigate(ROUTE_PATHS.SUBSCRIPTION)
  };

  const handleStartGame = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-GAME-TOKEN": `${API_TOKEN}`,
        },
        body: JSON.stringify({
          hostId: playerId,
          theme: theme,
          wordsPerPlayer: wordsPerPlayer,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
    } catch (err: any) {
      console.error(err);
      showAlertsModal("ERROR", err.message);
      setLoading(false);
    }
  };

  if (!room) {
    return <LoadingScreen />;
  }

  return (
    <div className="room-container">
      <h2 className="room-title">
        SALA {roomId} <CopyRoomCode roomId={roomId!} />
      </h2>
      <p>(Comparte el número de la sala para invitar jugadores)</p>

      <p className="room-status">
        ESTADO:{" "}
        {room.status === "waiting" ? "ESPERANDO JUGADORES..." : "JUGANDO"}
      </p>

      <h3 className="room-subtitle">JUGADORES</h3>

      <ul className="players-list">
        {Object.values(room?.players ?? {}).map((p) => (
          <li key={p.id} className="player-item">
            <span>&gt;</span> {p.nickname}
            {p.id === room.hostId && <span className="host-tag"> (HOST)</span>}
          </li>
        ))}
      </ul>

      {isHost && room.status === "waiting" && (
        <>
          <div className="theme-selector">
            <label className="theme-label">Elije el tema</label>
            <br></br>
            <select
              className="options-input"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="default">General</option>
              <option value="animals">Animales</option>
              <option value="movies" disabled={!isPremium}>Películas</option>
              <option value="movies80s" disabled={!isPremium}>Películas 80s</option>
              <option value="movies90s" disabled={!isPremium}>Películas 90s</option>
              <option value="series" disabled={!isPremium}>Series</option>
              <option value="harrypotter" disabled={!isPremium}>Harry Potter</option>
              <option value="simpsons" disabled={!isPremium}>The Simpsons</option>
            </select>
          </div>
          <div className="wordsPerPlayer-selector">
            <label className="wordsPerPlayer-label">
              Palabras a introducir
            </label>
            <br></br>
            <select
              className="options-input"
              value={wordsPerPlayer}
              onChange={(e) => setWordsPerPlayer(Number(e.target.value))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3" disabled={!isPremium}>3</option>
              <option value="4" disabled={!isPremium}>4</option>
              <option value="5" disabled={!isPremium}>5</option>
            </select>
          </div>
          {loading ? (
            <p className="loading-text">INICIANDO...</p>
          ) : (
            <button className="arcade-btn start-btn" onClick={handleStartGame}>
              INICIAR PARTIDA
            </button>
          )}
        </>
      )}
      {!isPremium && (
        <div className="premium-lock-message">
          <p>
            <span className="cursor">&gt;</span>
            FUNCIONES PREMIUM BLOQUEADAS
          </p>
          <Button
                text="HAZTE PREMIUM"
                styleClass="subscribe-btn"
                handleClick={handleExitSubscription}
                />
        </div>
      )}
    </div>
  );
};

export default RoomPage;
