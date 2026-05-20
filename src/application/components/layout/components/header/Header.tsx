import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import type { User } from "./utils/interfaces";

import { getEcho } from "../../../../../lib/echo";

import { ROUTE_PATHS } from "../../../routes/utils/route-paths";

import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL;
const echo = getEcho();

const Header: React.FC = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const playerId = localStorage.getItem("playerId");
  const isLoginPage = location.pathname.includes(ROUTE_PATHS.LOGIN);
  const isRegisterPage = location.pathname.includes(ROUTE_PATHS.REGISTER);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const inRoom = location.pathname.includes("room");

  const handleExit = async () => {
    if (!inRoom) {
      navigate(ROUTE_PATHS.HOME);
      return;
    }

    await handleExitRoom();
    navigate(ROUTE_PATHS.LOBBY);
  };

  const loginExit = async () => {
    if (!inRoom) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }

    await handleExitRoom();
    navigate(ROUTE_PATHS.LOGIN);
  };

  const registerExit = async () => {
    if (!inRoom) {
      navigate(ROUTE_PATHS.REGISTER);
      return;
    }

    await handleExitRoom();
    navigate(ROUTE_PATHS.REGISTER);
  };

  // Logout
  const handleLogout = async () => {
    localStorage.clear();
    setCurrentUser(null);
    if (!inRoom) {
      navigate(ROUTE_PATHS.HOME);
      return;
    }
    await handleExitRoom();
    navigate(ROUTE_PATHS.HOME);
  };

  const handleExitRoom = async () => {
    const socketId = echo.socketId();

    await fetch(`${API_URL}/api/rooms/${roomId}/exit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(socketId ? { "X-Socket-Id": socketId } : {}),
      },
      body: JSON.stringify({ playerId }),
    });
  };

  return (
    <header className="arcade-header">
      <h3 className="header-title">
        {/*<Link to="/home" className="header-link">
          <span className="cursor">&lt;</span>Volver
        </Link>*/}
        <button className="btn-exit" onClick={handleExit}>
          <span className="cursor">&lt;</span>Volver
        </button>
      </h3>

      {!currentUser && (
        <div className="header-buttons">
          {!isLoginPage && (
            <button className="arcade-btn" onClick={loginExit}>
              Login
            </button>
          )}

          {!isRegisterPage && (
            <button className="arcade-btn" onClick={registerExit}>
              Registro
            </button>
          )}
        </div>
      )}

      {currentUser && (
        <div className="header-user">
          <span className="user-name">Hola, {currentUser.name.split(" ")[0]}</span>
          <button className="arcade-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
