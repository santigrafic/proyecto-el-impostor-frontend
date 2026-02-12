import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "./components/login-form";

import "./Login.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      alert("No hay usuarios registrados");
      return;
    }

    const users = JSON.parse(storedUsers);

    const userFound = users.find(
      (user: any) =>
        user.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        user.password === password,
    );

    if (!userFound) {
      alert("Credenciales incorrectas");
      return;
    }

    // Guardar usuario logueado
    localStorage.setItem("currentUser", JSON.stringify(userFound));

    navigate("/home");
  };

  return (
    <div className="login-page">
      <h1 className="page-title">INICIAR SESIÓN</h1>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Introduce email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pwd" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="Introduce password"
              name="pswd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
