import { useState } from "react";
import { useNavigate } from "react-router-dom";

import './Lobby.css'

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  // const isGuest = localStorage.getItem("userType") === "guest";

  // Crear partida
  const handleCrearPartida = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/rooms", {
        method: "POST",
      });

      const data = await res.json();
      const roomID = data.roomId;
      const playerId = crypto.randomUUID();

      localStorage.setItem("roomId", roomID);
      localStorage.setItem("playerId", playerId);

      // Llamar al join del backend
      await fetch(`http://localhost:8000/api/rooms/${roomID}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId,
        }),
      });

      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la partida");
    }
  };

  // Unirse a partida
  const handleUnirsePartida = async () => {
    if (!roomID) {
      alert("Introduce un código de partida");
      return;
    }

    try {
      const playerId = crypto.randomUUID();

      const res = await fetch(
        `http://localhost:8000/api/rooms/${roomID}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            playerId,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("No se pudo unir a la sala");
      }

      localStorage.setItem("roomId", roomID.toUpperCase());
      localStorage.setItem("playerId", playerId);

      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error(error);
      alert("No se pudo unir a la partida");
    }
  };

  return (
    <div className="lobby-container">
      <h2 className="lobby-title">SALA DE JUEGO</h2>
      <p className="lobby-subtitle">Prepárate para jugar</p>

      <div className="crear-partida">
        <button className="arcade-btn full-width-create" onClick={handleCrearPartida}>
          Crear partida
        </button>
      </div>

      <div className="unirse-partida">
        <input
          type="text"
          placeholder="INSERT CODE"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value.toUpperCase())}
          className="code-input"
        />
        <button className="arcade-btn" onClick={handleUnirsePartida}>
          Unirse
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
