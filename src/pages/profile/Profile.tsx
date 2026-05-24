import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../commons/context/AlertsModalContext";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";
import type { UserProfile } from "./utils/interfaces";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";
import Button from "../../commons/components/presentational/button";

import "./Profile.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { showAlertsModal } = useModal();

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

      //if (!res.ok) throw new Error("Error cargando perfil");
      if (!res.ok) {
        const err = await res.json();
        showAlertsModal("ERROR", `${err.message}. Haz Login de nuevo`);
        localStorage.clear();
        navigate(ROUTE_PATHS.LOGIN);
        return;
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/me/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          //Accept: "application/json",
        },
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <span>&gt;</span> Nombre: {profile.name}
        </p>
        <p>
          <span>&gt;</span> Nickname: {profile.nickname}
        </p>
        <p>
          <span>&gt;</span> Email: {profile.email}
        </p>
      </section>

      {profile.isPremium && (
        <section className="premium-status">
          <h2 className="profile-subtitle">CUENTA PREMIUM ACTIVA</h2>
        </section>
      )}

      <section className="profile-section">
        <h2 className="profile-subtitle">Estadísticas</h2>

        <p>
          <span>&gt;</span> Partidas jugadas:{" "}
          {profile.gamesPlayed}
        </p>
        <p>
          <span>&gt;</span> Partidas ganadas:{" "}
          {profile.gamesWon}
        </p>
        <p>
          <span>&gt;</span> Veces impostor:{" "}
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
