import React from 'react'

import RegisterForm from "./components/register-form"

const RegisterPage: React.FC = () => {
  return (
    <div className="register-page">
      <h1>Registrarse</h1>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage;