import React from 'react'

import RegisterForm from "./components/register-form"

import "./Register.css";

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <h1 className="page-title">REGISTRARSE</h1>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage;