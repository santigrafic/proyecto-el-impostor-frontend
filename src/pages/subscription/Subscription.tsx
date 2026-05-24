import { useState } from "react";
import { Link } from "react-router-dom";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

import "./Subscription.css";

const API_URL = import.meta.env.VITE_API_URL;

const SubscriptionPage: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  const handlePremium = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();

    window.location.href = data.url;
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="premium-container">
      <pre className="premium-ascii">
        {`
██████╗ ██████╗ ███████╗███╗   ███╗██╗██╗   ██╗███╗   ███╗
██╔══██╗██╔══██╗██╔════╝████╗ ████║██║██║   ██║████╗ ████║
██████╔╝██████╔╝█████╗  ██╔████╔██║██║██║   ██║██╔████╔██║
██╔═══╝ ██╔══██╗██╔══╝  ██║╚██╔╝██║██║██║   ██║██║╚██╔╝██║
██║     ██║  ██║███████╗██║ ╚═╝ ██║██║╚██████╔╝██║ ╚═╝ ██║
╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝╚═╝ ╚═════╝ ╚═╝     ╚═╝

███╗   ███╗ ██████╗ ██████╗ ███████╗
████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██╔████╔██║██║   ██║██║  ██║█████╗
██║╚██╔╝██║██║   ██║██║  ██║██╔══╝
██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`}
      </pre>
      <div className="premium-features">
        <div className="premium-card">
          <span>01</span>
          <p>ELIGE EL TEMA DE LA PARTIDA</p>
        </div>

        <div className="premium-card">
          <span>02</span>
          <p>CONFIGURA EL NÚMERO DE PALABRAS</p>
        </div>

        <div className="premium-card">
          <span>03</span>
          <p>ACCESO A MODOS EXCLUSIVOS</p>
        </div>
      </div>

      <div className="premium-terminal">
        <p>
          <span className="cursor">&gt;</span>
          {"POR SOLO 5,99€ AL AÑO"}
        </p>
      </div>

      <button className="arcade-btn premium-btn" disabled={loading || !currentUser || currentUser.isPremium} onClick={handlePremium}>
        ACTIVAR PREMIUM
      </button>

      {!currentUser && (
        <p className="premium-login-warning">
          Haz <Link to="/login">login</Link> o <Link to="/register">regístrate</Link> para activar tu cuenta premium.
        </p>
      )}
      {currentUser?.isPremium && (
        <p className="premium-login-warning">
          Ya tienes una suscripción premium activa.
        </p>
      )}
    </div>
  );
};

export default SubscriptionPage;
