import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

import "./Lobby.css";

const API_URL = import.meta.env.VITE_API_URL;

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [roomID, setRoomID] = useState<string>("");

  const user = JSON.parse(localStorage.getItem("currentUser") || "null");
  let playerId = localStorage.getItem("playerId");

  // Crear partida
  const handleCreateRoom = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Error creando room");
      }

      const data = await res.json();
      const roomID = data.roomId;

      if (!playerId && user && user.id) {
        playerId = String(user.id); // usuario real de BD
      } else {
        if (!playerId) {
          playerId = crypto.randomUUID();
        }
      }

      localStorage.setItem("roomId", roomID);
      if (!localStorage.getItem("playerId"))
        localStorage.setItem("playerId", playerId);

      const joinRes = await fetch(`${API_URL}/api/rooms/${roomID}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId,
          nickname: user?.nickname || null,
        }),
      });

      if (!joinRes.ok) {
        const err = await joinRes.json();
        throw new Error(err.message || "Error al unirse");
      }

      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la partida");
      setLoading(false);
    }
  };

  // Unirse a partida
  const handleJoinRoom = async () => {
    if (!roomID) {
      alert("Introduce un código de partida");
      return;
    }

    setLoading(true);

    try {
      if (!playerId && user && user.id) {
        playerId = String(user.id); // usuario real de BD
      } else {
        if (!playerId) {
          playerId = crypto.randomUUID();
        }
      }

      localStorage.setItem("roomId", roomID);
      if (!localStorage.getItem("playerId"))
        localStorage.setItem("playerId", playerId);

      const res = await fetch(`${API_URL}/api/rooms/${roomID}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId,
          nickname: user?.nickname || null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "No se pudo unir a la sala");
      }

      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error(error);
      alert("No se pudo unir a la partida");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="lobby-container">
      <h2 className="lobby-title">SALA DE JUEGO</h2>
      <p className="lobby-subtitle">Prepárate para jugar</p>

      <div className="crear-partida">
        <button
          className="arcade-btn full-width-create"
          onClick={handleCreateRoom}
        >
          Crear partida
        </button>
      </div>

      <div className="unirse-partida">
        <input
          type="text"
          placeholder="CÓDIGO"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value.toUpperCase())}
          className="code-input"
        />
        <button className="arcade-btn" onClick={handleJoinRoom}>
          Unirse
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
