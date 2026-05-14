import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./Register.css";

const API_URL = import.meta.env.VITE_API_URL;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState<any>({
    name: "",
    nickname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleSubmitRegisterForm = async () => {
    if (registerForm.password !== registerForm.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

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
    navigate("/home");
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
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
              id="pwd"
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
            disabled={false}
            onClick={handleSubmitRegisterForm}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
