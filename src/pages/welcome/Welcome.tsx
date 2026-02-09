import React from "react";

import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import './Welcome.css'

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  //Para ir a la home
  const handleStart = () => {
    navigate('/home');
  };

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

export default Welcome;
