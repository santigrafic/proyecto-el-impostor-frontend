import { useNavigate } from "react-router-dom";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

import Button from "../../commons/components/presentational/button";

import impostorIcon from "../../application/assets/images/impostor-logo-green-pixel.svg";

import "./Home.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handlePlay = () => {
    navigate(ROUTE_PATHS.LOBBY);
  };

  return (
    <div className="home-container">
      <div className="home-logo-wrapper">
        <img src={impostorIcon} className="home-logo" alt="Impostor Logo" />
      </div>

      <h1 className="home-title">BIENVENIDO A EL IMPOSTOR</h1>

      <p className="home-subtitle">
        <span className="cursor">&gt;</span>Descubre quién miente… o traiciona a
        los demás.
      </p>

      <div className="home-buttons">
        <Button text="JUGAR" styleClass="arcade-btn" handleClick={handlePlay} />
        {currentUser ? (
          <>
            <Button
              text="VER PERFIL"
              styleClass="arcade-btn"
              handleClick={() => navigate(ROUTE_PATHS.PROFILE)}
            />
            <Button
              text="VER RANKING"
              styleClass="arcade-btn"
              handleClick={() => navigate(ROUTE_PATHS.RANKING)}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      
      <div className="subscribe-buttons">
        {currentUser?.isPremium ? (
          <button
            className="premium-active-btn"
            disabled
          >
            PREMIUM ACTIVADO
          </button>
        ) : (
          <Button
                text="HAZTE PREMIUM"
                styleClass="subscribe-btn"
                handleClick={() => navigate(ROUTE_PATHS.SUBSCRIPTION)}
                />)}
      </div>
      
    </div>
  );
};

export default HomePage;
