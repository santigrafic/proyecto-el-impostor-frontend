import React from 'react'

import { useNavigate } from 'react-router-dom'

import { ROUTE_PATHS } from '../../application/components/routes/utils/route-paths';

import Button from '../../commons/components/presentational/button'

import impostorIcon from '../../application/assets/images/impostor-logo-green-pixel.svg'

import './Home.css'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  const handleGuestPlay = () => {
    localStorage.setItem('userType', 'guest')
    navigate('/lobby')
  }

  return (
    <div className="home-container">
      {/* Logo */}
      <div className="home-logo-wrapper">
        <img src={impostorIcon} className="home-logo" alt="Impostor Logo" />
      </div>

      {/* Título */}
      <h1 className="home-title">BIENVENIDO A EL IMPOSTOR</h1>

      {/* Subtítulo */}
      <p className="home-subtitle"><span className="cursor">&gt;</span>Descubre quién miente… o traiciona a los demás.</p>

      {/* Botones */}
      <div className="home-buttons">
        <Button
          text="LOGIN"
          styleClass="arcade-btn"
          handleClick={() => navigate(ROUTE_PATHS.LOGIN)}
        />
        <Button
          text="REGISTRO"
          styleClass="arcade-btn"
          handleClick={() => navigate(ROUTE_PATHS.REGISTER)}
        />
        <Button
          text="JUGAR"
          styleClass="arcade-btn"
          handleClick={handleGuestPlay}
        />
      </div>
    </div>
  );
};

export default HomePage;
