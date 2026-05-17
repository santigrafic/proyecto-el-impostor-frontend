import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import type { RegisterFormType } from "./utils/types";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

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

  const handleSubmitRegisterForm = async () => {
    // VALIDAR NOMBRE
    if (registerForm.name.trim().length < 3) {
      alert("El nombre debe tener al menos 3 caracteres");
      return;
    }

    // VALIDAR NICK
    if (registerForm.nickname.trim().length < 3) {
      alert("El nick debe tener al menos 3 caracteres");
      return;
    }

    // VALIDAR EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(registerForm.email)) {
      alert("Introduce un email válido");
      return;
    }

    // VALIDAR PASSWORD
    if (registerForm.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    // VALIDAR REPETICIÓN PASSWORD
    if (registerForm.password !== registerForm.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        alert(err.message || "Error en el registro");
        return;
      }

      const data = await res.json();

      // guardar login automático si quieres
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      alert("Usuario registrado correctamente");
      navigate(ROUTE_PATHS.HOME);
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
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
              className="form-control"
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
              className="form-control"
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
              className="form-control"
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
              className="form-control"
              id="pwd"
              placeholder="Introduce password"
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
              className="form-control"
              id="repwd"
              placeholder="Repite password"
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
            className="btn btn-primary"
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
