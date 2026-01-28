import React from 'react'

import LoginForm from "./components/login-form"

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <h1>Iniciar sesión</h1>
      <LoginForm />
    </div>
  )
}

export default LoginPage;