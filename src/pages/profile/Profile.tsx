import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";
import Button from "../../commons/components/presentational/button";

import "./Profile.css";
import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";
import type { UserProfile } from "./utils/interfaces";

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }

    fetchProfile(token);
  }, []);

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

  const handlePrint = () => {
    window.print();
  };

  // if (loading) return <p>Cargando perfil...</p>;
  if (loading) {
    return <LoadingScreen />;
  }
  if (!profile) return <p>Error cargando perfil</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">PERFIL DE USUARIO</h1>

      <section className="profile-section">
        <p>
          <span className="cursor">&gt;</span> Nombre: {profile.name}
        </p>
        <p>
          <span className="cursor">&gt;</span> Nickname: {profile.nickname}
        </p>
        <p>
          <span className="cursor">&gt;</span> Email: {profile.email}
        </p>
      </section>

      <section className="profile-section">
        <h2 className="profile-subtitle">Estadísticas</h2>

        <p>
          <span className="cursor">&gt;</span> Partidas jugadas:{" "}
          {profile.gamesPlayed}
        </p>
        <p>
          <span className="cursor">&gt;</span> Partidas ganadas:{" "}
          {profile.gamesWon}
        </p>
        <p>
          <span className="cursor">&gt;</span> Veces impostor:{" "}
          {profile.timesImpostor}
        </p>
      </section>
      <section className="profile-btn">
        <Button
              text="EDITAR"
              styleClass="arcade-btn edit-btn"
              handleClick={() => navigate(ROUTE_PATHS.EDITPROFILE)}
            />
      <Button
              text="IMPRIMIR"
              styleClass="arcade-btn print-btn"
              handleClick={handlePrint}
            />
      </section>
    </div>
  );
};

export default ProfilePage;
