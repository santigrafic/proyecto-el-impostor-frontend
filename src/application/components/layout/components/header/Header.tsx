import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getEcho } from "../../../../../lib/echo";
const echo = getEcho();

import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  name: string;
  email: string;
  userAvatar?: string; // opcional
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const location = useLocation();
  const roomId = location.pathname.split("/")[2];
  const playerId = localStorage.getItem("playerId");
  const isLoginPage = location.pathname.includes("/login");
  const isRegisterPage = location.pathname.includes("/register");

  // Comprobar si hay usuario logueado al cargar
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/home");
  };

  // Volver
  const inRoom = location.pathname.includes("room");

  const handleExit = async () => {
    if (!inRoom) {
      navigate("/home");
      return;
    }

    await handleExitRoom();
    navigate("/lobby");
  };

  const loginExit = async () => {
    if (!inRoom) {
      navigate("/login");
      return;
    }

    await handleExitRoom();
    navigate("/login");
  };

  const registerExit = async () => {
    if (!inRoom) {
      navigate("/register");
      return;
    }

    await handleExitRoom();
    navigate("/register");
  };

  const handleExitRoom = async () => {
    const socketId = echo.socketId();
    console.log("socketId:", socketId);

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
