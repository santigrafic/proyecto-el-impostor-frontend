import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div
      className="lobby-container"
      style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}
    >
      <h2>Sala de Juego</h2>
      <p>Bienvenido al juego El Impostor</p>

      <div className="crear-partida" style={{ margin: "20px 0" }}>
        <button
          className="btn btn-success"
          onClick={handleCrearPartida}
          style={{ width: "400px", padding: "10px", fontSize: "16px" }}
        >
          Crear partida
        </button>
      </div>

      <div className="unirse-partida" style={{ margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Introduce código de partida"
          value={roomID}
          onChange={(e) => setRoomID(e.target.value.toUpperCase())}
          style={{
            width: "70%",
            padding: "8px",
            fontSize: "16px",
            marginRight: "5px",
          }}
        />
        <button
          className="btn btn-primary"
          onClick={handleUnirsePartida}
          style={{ padding: "8px 12px", fontSize: "16px" }}
        >
          Unirse
        </button>
      </div>
    </div>
  );
};

export default LobbyPage;
