import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./Register.css";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState<any>({
    userName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const hundleSubmitRegisterForm = () => {
    if (registerForm.password === registerForm.repeatPassword) {
      const isUsersList = Boolean(localStorage.getItem("users"));
      let tempUsersList = [];

      if (isUsersList)
        tempUsersList = JSON.parse(localStorage.getItem("users") as string);

      tempUsersList.push({
        userName: registerForm.userName,
        email: registerForm.email,
        password: registerForm.password,
      });

      const registedUser = {
        userName: registerForm.userName.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
      };

      localStorage.setItem("users", JSON.stringify(tempUsersList));
      localStorage.setItem("currentUser", JSON.stringify(registedUser));
      alert("Usuario registrado correctamente");
      navigate("/home");
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
                  userName: e.target.value,
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
            onClick={hundleSubmitRegisterForm}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
