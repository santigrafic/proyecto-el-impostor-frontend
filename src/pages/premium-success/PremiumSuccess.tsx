import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../commons/context/AlertsModalContext";

import { ROUTE_PATHS } from "../../application/components/routes/utils/route-paths";

import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

const API_URL = import.meta.env.VITE_API_URL;

import "./PremiumSuccess.css";

const PremiumSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { showAlertsModal } = useModal();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(ROUTE_PATHS.LOGIN);
      return;
    }

    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      //if (!res.ok) throw new Error("Error cargando perfil");
      if (!res.ok) {
        const err = await res.json();
        showAlertsModal("ERROR", `${err.message}. Haz Login de nuevo`);
        localStorage.clear();
        navigate(ROUTE_PATHS.LOGIN);
        return;
      }

      // Consultar isPremium y ponerlo a true
      //const data = await res.json();
      const currentUser = JSON.parse(localStorage.getItem("currentUser")!);
      //currentUser.isPremium = data.isPremium;
      currentUser.isPremium = "true";
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } catch (err) {
      console.error(err);
      showAlertsModal("ERROR", "Haz Login de nuevo");
      localStorage.clear();
      navigate(ROUTE_PATHS.LOGIN);
    } finally {
      setLoading(false);
    }
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
      <div className="premium-success">
        <h1>PAGO COMPLETADO</h1>

        <p>Tu cuenta premium ha sido activada.</p>
      </div>
    </div>
  );
};

export default PremiumSuccess;
