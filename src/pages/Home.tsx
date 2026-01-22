import impostorIcon from '../assets/images/impostor-logo.png'

const Home = () => {
  return (
    <>
    <div className="text-center">

        <div className="mb-4 d-flex justify-content-center">
            <img src={impostorIcon} alt="Icono Juego El Impostor" className="rounded-4" style={{width: '400px', height: '400px', objectFit: 'cover'}} />
        </div>

      <h1 className="mb-4">BIENVENIDO A EL IMPOSTOR</h1>

      <p className="text-secondary mb-4">
        Descubre quién miente… o conviértete en él.
      </p>

      <div className="d-flex justify-content-center gap-3">
        <button className="btn btn-primary">
          Iniciar sesión
        </button>

        <button className="btn btn-outline-light">
          Registrarse
        </button>
      </div>
      <br></br>
      <div>
        <button className="btn btn-secondary">
          Jugar como invitado
        </button>
      </div>

    </div>
    </>
  );
};

export default Home;
