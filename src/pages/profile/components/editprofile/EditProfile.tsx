import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./EditProfile.css";

import { ROUTE_PATHS } from "../../../../application/components/routes/utils/route-paths";
import type { UserProfile } from "./utils/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>();
  const [name, setName] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }

    fetchProfile(token);
  }, [localStorage]);

  const fetchProfile = async (token: string) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Error cargando perfil");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/update`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          nickname,
          email,
        }),
      });

      if (!res.ok) {
        alert("Fallo al guardar");
        return;
      }

      const data = await res.json();

      // guardar token + usuario
      //localStorage.setItem("token", data.token);
      localStorage.currentUser.clear();
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate(ROUTE_PATHS.PROFILE);
    } catch (err) {
      console.error(err);
      alert("Error editando información");
      setLoading(false);
    }
  };

  if (!profile) return <p>Error cargando perfil</p>;

  return (
    <div className="login-page">
      <h1 className="page-title">EDITAR PERFIL</h1>
      <div className="login-form">
        <form onSubmit={editSubmit}>
          <div className="mb-3 mt-3">
            <label htmlFor="name" className="form-label">
              Modificar Nombre:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder={profile.name}
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="nickname" className="form-label">
              Modificar Nickname:
            </label>
            <input
              type="text"
              className="form-control"
              id="nickname"
              placeholder={profile.nickname}
              name="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">
              Modificar Email:
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder={profile.email}
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Editando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
