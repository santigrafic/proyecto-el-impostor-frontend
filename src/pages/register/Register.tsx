import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import type { RegisterFormType } from "./utils/types";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

import { useModal } from "../../commons/context/AlertsModalContext";

import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    name: "",
    nickname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const { showAlertsModal } = useModal();

  const handleSubmitRegisterForm = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: registerForm.name,
          nickname: registerForm.nickname,
          email: registerForm.email,
          password: registerForm.password,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        showAlertsModal("ERROR", err.message);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // guardar login automático si quieres
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      showAlertsModal("OK", "Usuario registrado correctamente");
      navigate(ROUTE_PATHS.HOME);
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "Error en el registro");
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1 className="page-title">REGISTRARSE</h1>
      <div className="register-form">
        <form id="formRegistro">
          <div className="mb-3 mt-3">
            <label htmlFor="name" className="form-label">
              Nombre:
            </label>
            <input
              type="text"
              className="arcade-input"
              id="name"
              placeholder="Introduce nombre"
              name="name"
              onChange={(e: any) =>
                setRegisterForm({
                  ...registerForm,
                  name: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="nickname" className="form-label">
              Nick:
            </label>
            <input
              type="text"
              className="arcade-input"
              id="nickname"
              placeholder="Introduce nick"
              name="nickname"
              onChange={(e: any) =>
                setRegisterForm({
                  ...registerForm,
                  nickname: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input
              type="email"
              className="arcade-input"
              id="email"
              placeholder="Introduce email"
              name="email"
              onChange={(e: any) =>
                setRegisterForm({
                  ...registerForm,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="pwd" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="arcade-input"
              id="pwd"
              placeholder="Introduce pass"
              name="pswd"
              onChange={(e: any) =>
                setRegisterForm({
                  ...registerForm,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="repwd" className="form-label">
              Repetir Password:
            </label>
            <input
              type="password"
              className="arcade-input"
              id="repwd"
              placeholder="Repite pass"
              name="repswd"
              onChange={(e: any) =>
                setRegisterForm({
                  ...registerForm,
                  repeatPassword: e.target.value,
                })
              }
            />
          </div>
          <button
            type="button"
            className="arcade-btn"
            disabled={loading}
            onClick={handleSubmitRegisterForm}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
