import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { playWelcomeButton } from "../../commons/utils/soundManager";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

import "./Welcome.css";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    playWelcomeButton();
    navigate(ROUTE_PATHS.HOME);
  }
  // Pulsando enter vamos a la home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        handleStart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="splash-container" onClick={handleStart}>
      <div className="splash-content">
        <h1 className="welcome-title">EL IMPOSTOR</h1>
        <h2 className="insert-coin">INSERT COIN</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
