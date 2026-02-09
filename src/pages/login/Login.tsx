import React from "react";

import LoginForm from "./components/login-form";

import "./Login.css";

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <h1 className="page-title">INICIAR SESIÓN</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
