import React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Player = {
  id: number;
  nickname: string;
};

type GameState = {
  status: "lobby" | "playing" | "finished";
  hostId: number;
  players: Player[];
};

const GamePage: React.FC = () => {
  const roomID = localStorage.getItem("roomId");
  const [state, setState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!roomID) {
    throw new Error("Room ID no encontrado");
  }

  const loadState = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/rooms/${roomID}/state`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!res.ok) throw new Error("Error cargando el estado");

      const data = await res.json();
      setState(data);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("No se ha podido conectar con el servidor de backend");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadState();
    const interval = setInterval(loadState, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando partida...</p>;
  if (error) return <p>{error}</p>;
  if (!state) return null;

  return (
    <div className="game-page">
      <h1>El Impostor</h1>

      <p>
        Estado de la partida: <strong>{state.status.toUpperCase()}</strong>
      </p>

      <h2>Jugadores</h2>
      <ul>
        {state.players.map((player) => (
          <li key={player.id}>
            {player.nickname}
            {player.id === state.hostId && " ⭐"}
          </li>
        ))}
      </ul>

      {state.status === "lobby" && (
        <p>Esperando a que el host inicie la partida...</p>
      )}

      {state.status === "playing" && <p>La partida está en curso</p>}

      {state.status === "finished" && <p>La partida ha terminado</p>}
    </div>
  );
};

export default GamePage;
