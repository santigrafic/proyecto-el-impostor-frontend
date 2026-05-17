import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";
import CopyRoomCode from "../../commons/components/copyRoomCode/CopyRoomCode";

import { getEcho } from "../../lib/echo";
const echo = getEcho();

import "./Room.css";

const API_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_GAME_API_TOKEN;

interface Player {
  id: string;
  nickname: string;
}

interface RoomState {
  hostId: string;
  players: Player[];
  status: "waiting" | "playing";
}

const RoomPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomState | null>(null);
  const [isHost, setIsHost] = useState(false);

  const playerId = localStorage.getItem("playerId");

  const hasNavigatedRef = useRef(false);

  const [theme, setTheme] = useState<string>("default");
  const [wordsPerPlayer, setWordsPerPlayer] = useState<number>(1);

  const [loading, setLoading] = useState(false);

  // Fetch inicial (solo 1 vez)
  const fetchRoomState = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/state`);
      if (!res.ok) throw new Error("Error al obtener estado de la sala");

      const data = await res.json();

      setRoom(data);
      setIsHost(playerId === data.hostId);

      if (data.status === "playing" && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate(`/game/${roomId}`);
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la sala");
    }
  };

  const handleStartGame = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms/${roomId}/start`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-GAME-TOKEN": `${API_TOKEN}`,
       },
        body: JSON.stringify({ hostId: playerId, theme: theme, wordsPerPlayer: wordsPerPlayer }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /*const handleLeaveRoom = async () => {
    const socketId = (window as any).Echo?.socketId();

    await fetch(`${API_URL}/api/rooms/${roomId}/leave`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Socket-Id": socketId,
      },
      body: JSON.stringify({ playerId }),
    });

    navigate("/home");
  };*/

  useEffect(() => {
    if (!roomId) return;

    fetchRoomState();

    console.log("SUBSCRIBED TO ROOM:", roomId);

    const channel = echo.channel(`room.${roomId}`);

    // Player joined
    channel.listen(".player.joined", (event: any) => {
      console.log("PLAYER JOINED", event);

      setRoom(event.room);
      setIsHost(playerId === event.room.hostId);
    });

    // Player exits
    channel.listen(".room.exit", (event: any) => {
      console.log("PLAYER LEFT ROOM", event);
      setRoom(event.room);
    });

    // Host exits
    channel.listen(".room.closed", () => {
      alert("El host abandonó la partida. La sala se ha cerrado.");
      navigate("/home");
    });

    // Game started
    channel.listen(".game.started", (event: any) => {
      console.log("GAME STARTED", event);

      if (!hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate(`/game/${roomId}`);
      }
    });

    return () => {
      echo.leave(`room.${roomId}`);
    };
  }, [roomId]);

  // if (!room) return <div className="room-charge">CARGANDO SALA...</div>;

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
              <option value="movies">Películas</option>
              <option value="movies80s">Películas 80s</option>
              <option value="movies90s">Películas 90s</option>
              <option value="series">Series</option>
              <option value="harrypotter">Harry Potter</option>
              <option value="simpsons">The Simpsons</option>
            </select>
          </div>
          <div className="wordsPerPlayer-selector">
            <label className="wordsPerPlayer-label">Palabras a introducir</label>
            <br></br>
            <select
              className="options-input"
              value={wordsPerPlayer}
              onChange={(e) => setWordsPerPlayer(Number(e.target.value))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
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
    </div>
  );
};

export default RoomPage;
