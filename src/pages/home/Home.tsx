import { useNavigate } from 'react-router-dom'

import Button from '../../commons/components/presentational/button'

import impostorIcon from '../../application/assets/images/impostor-logo.png'

const HomePage = () => {
  const navigate = useNavigate()

  const handleGuestPlay = () => {
    localStorage.setItem('userType', 'guest')
    navigate('/lobby')
  }

  return (
    <div className="text-center">

      <div className="mb-4 d-flex justify-content-center">
        <img src={impostorIcon} alt="Icono Juego El Impostor" className="rounded-4" style={{width: '400px', height: '400px', objectFit: 'cover'}} />
      </div>

      <h1 className="mb-4">BIENVENIDO A EL IMPOSTOR</h1>

      <p className="text-secondary mb-4">
        Descubre quién miente… o conviértete en él.
      </p>

      <div className="d-flex justify-content-center gap-3">
        <Button text="Iniciar sesión" styleClass="btn btn-primary" handleClick={() => navigate('/login')} />
        <Button text="Registrarse" styleClass="btn btn-outline-light" handleClick={() => navigate('/register')} />
      </div>
      <br></br>
      <div>
        <Button text="Jugar como invitado" styleClass="btn btn-secondary" handleClick={handleGuestPlay} />
      </div>

    </div>
  );
};

export default HomePage;
