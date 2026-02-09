import { Link, useNavigate } from "react-router-dom";

import "./Header.css";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const userType: string = localStorage.getItem("userType") ?? "guest";
  const userName: string = localStorage.getItem("userName") ?? "Guest";
  // TODO: Add default avatar
  const userAvatar: string = localStorage.getItem("userAvatar") ?? "";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/lobby");
  };

  return (
    <header className="arcade-header">
      <h3 className="header-title">
        <Link to="/home" className="header-link">
          <span className="cursor">_</span>Return
        </Link>
      </h3>

      {userType === "guest" && (
        <div className="header-buttons">
          <button className="arcade-btn" onClick={() => navigate("/login")}>
            Login
          </button>
          <button
            className="arcade-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      )}

      {userType === "user" && (
        <div className="header-user">
          <img src={userAvatar} alt="Avatar" className="user-avatar" />
          <span className="user-name">{userName}</span>
          <div className="dropdown">
            <button
              className="arcade-btn"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Opciones
            </button>
            <ul
              className="dropdown-menu dropdown-menu-end"
              aria-labelledby="userMenu"
            >
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => navigate("/profile")}
                >
                  Perfil
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
