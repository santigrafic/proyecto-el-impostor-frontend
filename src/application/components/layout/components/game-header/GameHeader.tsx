import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getEcho } from "../../../../../lib/echo";
const echo = getEcho();

import "./GameHeader.css";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  name: string;
  email: string;
  userAvatar?: string; // opcional
}

const GameHeader: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const playerId = localStorage.getItem("playerId");

  // Comprobar si hay usuario logueado al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      console.log(currentUser);
    }
  }, []);

  const handleExitGame = async () => {
    const confirmExit = window.confirm(
      "¿Seguro que quieres salir? La partida termina aquí.",
    );

    if (!confirmExit) return;

    try {
      const socketId = echo.socketId();
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

  return (
    <header className="arcade-header">
      <h3 className="header-title">
        {/*<Link to="/home" className="header-link">
          <span className="cursor">&lt;</span>Volver
        </Link>*/}
        <button className="btn-exit" onClick={handleExitGame}>
          <span className="cursor">&lt;</span>Salir
        </button>
      </h3>
    </header>
  );
};

export default GameHeader;
