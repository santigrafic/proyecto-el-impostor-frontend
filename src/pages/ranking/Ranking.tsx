import React, { useEffect, useState } from "react";
import LoadingScreen from "../../commons/components/loadingScreen/LoadingScreen";

import type { PlayerRanking } from "./utils/interfaces";

import "./Ranking.css";

const API_URL = import.meta.env.VITE_API_URL;

const Ranking: React.FC = () => {
  const [ranking, setRanking] = useState<PlayerRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/ranking`);

      if (!res.ok) throw new Error("Error cargando ranking");

      const data = await res.json();
      setRanking(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <p>Cargando ranking...</p>;
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="ranking-container">
      <h1 className="ranking-title">TOP 16 JUGADORES</h1>
      <section>
        <li className="ranking-item-title">
          <span className="ranking-left">Nickname</span>
          <span className="ranking-item-title-space"></span>
          <span className="ranking-right">WINS//%</span>
        </li>
      </section>
      <section className="ranking-section">
        {ranking.length === 0 ? (
          <p>No hay datos de ranking</p>
        ) : (
          <ol className="ranking-list">
            {ranking.map((user) => (
              <li key={user.id} className="ranking-item">
                <span className="ranking-left">
                  <span className="cursor">&gt;</span>
                  {user.nickname}
                </span>
                <span className="ranking-dots"></span>
                <span className="ranking-right">{user.games_won}//{user.win_rate}%</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
};

export default Ranking;
