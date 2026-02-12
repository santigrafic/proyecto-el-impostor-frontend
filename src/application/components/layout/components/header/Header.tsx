import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./Header.css";

interface User {
  userName: string;
  email: string;
  password: string;
  userAvatar?: string; // opcional
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

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

  return (
    <header className="arcade-header">
      <h3 className="header-title">
        <Link to="/home" className="header-link">
          <span className="cursor">&lt;</span>Volver
        </Link>
      </h3>

      {!currentUser && (
        <div className="header-buttons">
          <button className="arcade-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="arcade-btn"
            onClick={() => navigate("/register")}
          >
            Registro
          </button>
        </div>
      )}

      {currentUser && (
        <div className="header-user">
          <span className="user-name">Hola, {currentUser.userName}</span>
          <button className="arcade-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
