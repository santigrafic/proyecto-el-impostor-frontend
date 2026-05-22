import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTE_PATHS } from "../../../../application/components/routes/utils/route-paths";

import LoadingScreen from "../../../../commons/components/loadingScreen";

import type { UserProfile } from "./utils/interfaces";
import type { EditProfileFormType } from "./utils/types";

import { useModal } from "../../../../commons/context/AlertsModalContext";

import "./EditProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(false);

  const { showAlertsModal } = useModal();

  const token = localStorage.getItem("token");

  const [editProfileForm, setEditProfileForm] = useState<EditProfileFormType>({
    name: "",
    nickname: "",
    email: "",
  });

  useEffect(() => {
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

      setEditProfileForm({
        name: data.name,
        nickname: data.nickname,
        email: data.email,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEditProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile) return;

    setLoading(true);

    const updatedData = {
      name: editProfileForm.name.trim() || profile.name,
      nickname: editProfileForm.nickname.trim() || profile.nickname,
      email: editProfileForm.email.trim() || profile.email,
    };

    try {
      const res = await fetch(`${API_URL}/api/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const err = await res.json();
        showAlertsModal("ERROR", err.message);
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.removeItem("currentUser");
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      showAlertsModal("OK", "Jugador actualizado");
      navigate(ROUTE_PATHS.PROFILE);
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "Error editando información");
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return <LoadingScreen />;
  }

  return (
    <div className="login-page">
      <h1 className="page-title">EDITAR PERFIL</h1>
      <div className="edit-form">
        <form id="editProfileForm" onSubmit={handleSubmitEditProfileForm}>
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
              value={editProfileForm.name}
              onChange={(e: any) =>
                setEditProfileForm({
                  ...editProfileForm,
                  name: e.target.value.replace(/\s+/g, " "),
                })
              }
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
              value={editProfileForm.nickname}
              onChange={(e: any) =>
                setEditProfileForm({
                  ...editProfileForm,
                  nickname: e.target.value,
                })
              }
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
              value={editProfileForm.email}
              onChange={(e: any) =>
                setEditProfileForm({
                  ...editProfileForm,
                  email: e.target.value,
                })
              }
            />
          </div>
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Editando..." : "Confirmar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
