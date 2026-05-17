import { useNavigate, useLocation } from "react-router-dom";

import { getEcho } from "../../../../../lib/echo";

import { ROUTE_PATHS } from "../../../routes/utils/route-paths";

import "./GameHeader.css";

const API_URL = import.meta.env.VITE_API_URL;
const echo = getEcho();

const GameHeader: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const playerId = localStorage.getItem("playerId");

  const handleExitGame = async () => {
    const confirmExit = window.confirm(
      "¿Seguro que quieres salir? La partida terminará",
    );

    if (!confirmExit) return;

    try {
      const socketId = echo.socketId();
      await fetch(`${API_URL}/api/games/${roomId}/exit`, {
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

      navigate(ROUTE_PATHS.HOME);
    } catch (error) {
      console.error("Error exiting game:", error);
    }
  };

  return (
    <header className="arcade-header">
      <h3 className="header-title">
        <button className="btn-exit" onClick={handleExitGame}>
          <span className="cursor">&lt;</span>Salir
        </button>
      </h3>
    </header>
  );
};

export default GameHeader;
