import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Login.css";
import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

const API_URL = import.meta.env.VITE_API_URL;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = await res.json();

      // guardar token + usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate(ROUTE_PATHS.HOME);
    } catch (err) {
      console.error(err);
      alert("Error en el login");
      setLoading(false);
    }
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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Accediendo..." : "Acceder"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
