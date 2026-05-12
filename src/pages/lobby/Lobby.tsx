import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

//import useLobby from "./hooks/use-lobby";

import './Lobby.css'

const API_URL = import.meta.env.VITE_API_URL;

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //const { createGame, joinGame } = useLobby();

  const [roomID, setRoomID] = useState("");
  // const isGuest = localStorage.getItem("userType") === "guest";

  // Crear partida
  const handleCrearPartida = async () => {
    //createGame()
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
      console.log(roomID);
      console.log(data);


      // Generar playerId
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");

      let playerId;

      if (user?.id) {
        playerId = String(user.id);; // usuario real de BD
      } else {
        let guestId = localStorage.getItem("guestId");

        if (!guestId) {
          guestId = crypto.randomUUID();
          localStorage.setItem("guestId", guestId);
        }

        playerId = guestId;
      }

      localStorage.setItem("roomId", roomID);
      localStorage.setItem("playerId", playerId);

      // navigate(`/room/${roomID}`);

      // Llamar al join del backend
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

      console.log(user);
      navigate(`/room/${roomID}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la partida");
    } finally {
    setLoading(false);
  }
  };

  // Unirse a partida
  const handleUnirsePartida = async () => {
  if (!roomID) {
    alert("Introduce un código de partida");
    return;
  }

  setLoading(true);

  try {
    const user = JSON.parse(
      localStorage.getItem("currentUser") || "null",
    );

    let playerId;

    // Usuario logueado
    if (user?.id) {
      playerId = String(user.id);
    } else {
      // Invitado
      let guestId = localStorage.getItem("guestId");

      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }

      playerId = guestId;
    }

    const res = await fetch(
      `${API_URL}/api/rooms/${roomID}/join`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId,
          nickname: user?.nickname || null,
        }),
      },
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "No se pudo unir a la sala");
    }

    localStorage.setItem("roomId", roomID.toUpperCase());
    localStorage.setItem("playerId", String(playerId));

    navigate(`/room/${roomID}`);
  } catch (error) {
    console.error(error);
    alert("No se pudo unir a la partida");
  } finally {
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
        <button className="arcade-btn full-width-create" onClick={handleCrearPartida}>
          Crear partida
        </button>
      </div>

      <div className="unirse-partida">
        <input
          type="text"
          placeholder="INS. CÓDIGO"
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
