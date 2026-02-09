import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import './Room.css'

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
  const playerId = localStorage.getItem("playerId"); // tu id guardado al unirse

  // Función para hacer polling al backend
  const fetchRoomState = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/rooms/${roomId}/state`,
      );
      if (!res.ok) throw new Error("Error al obtener estado de la sala");
      const data = await res.json();
      setRoom(data);

      // Redirigir a GamePage si la partida ha empezado
      if (data.status === "playing") {
        navigate(`/game/${roomId}`);
      }

      // Comprobar si soy host
      setIsHost(playerId === data.hostId);
    } catch (err) {
      console.error(err);
      alert("No se pudo cargar la sala");
    }
  };

  // Start game (solo host)
  const handleStartGame = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/rooms/${roomId}/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hostId: playerId }),
        },
      );
      if (!res.ok) throw new Error("No se pudo iniciar la partida");
      await fetchRoomState(); // actualizar inmediatamente
    } catch (err) {
      console.error(err);
      alert("Error al iniciar la partida");
    }
  };

  useEffect(() => {
    fetchRoomState();
    const interval = setInterval(fetchRoomState, 2000); // polling cada 2s
    return () => clearInterval(interval);
  }, []);

  if (!room) return <div>Cargando sala...</div>;

  return (
    <div className="room-container">
      <h2 className="room-title">SALA {roomId}</h2>

      <p className="room-status">
        ESTADO:{" "}
        {room.status === "waiting" ? "ESPERANDO JUGADORES..." : "JUGANDO"}
      </p>

      <h3 className="room-subtitle">JUGADORES</h3>

      <ul className="players-list">
        {room.players.map((p) => (
          <li key={p.id} className="player-item">
            <span className="cursor">&gt;</span> {p.nickname}
            {p.id === room.hostId && <span className="host-tag"> (HOST)</span>}
          </li>
        ))}
      </ul>

      {isHost && room.status === "waiting" && (
        <button className="arcade-btn start-btn" onClick={handleStartGame}>
          Iniciar partida
        </button>
      )}
    </div>
  );
};

export default RoomPage;
