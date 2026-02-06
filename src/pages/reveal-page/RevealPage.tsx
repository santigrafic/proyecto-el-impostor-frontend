import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RevealPage: React.FC = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState<'player' | 'impostor' | null>(null);
  const [word, setWord] = useState<string | null>(null);

  useEffect(() => {
    // Simulación de rol (para demo)
    const roles: Array<'player' | 'impostor'> = ['player', 'player', 'impostor'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];

    setRole(randomRole);
    localStorage.setItem('role', randomRole);

    if (randomRole === 'player') {
      const secretWord = 'PLAYA'; // luego vendrá del backend
      setWord(secretWord);
      localStorage.setItem('word', secretWord);
    } else {
      localStorage.removeItem('word');
    }
  }, []);

  const handleStart = () => {
    navigate('/game');
  };

  if (!role) return <p>Cargando...</p>;

  return (
    <div className="reveal-page">
      <h1>Tu rol</h1>

      {role === 'player' && (
        <>
          <h2>Eres JUGADOR</h2>
          <p>La palabra es:</p>
          <strong>{word}</strong>
        </>
      )}

      {role === 'impostor' && (
        <>
          <h2>Eres el IMPOSTOR</h2>
          <p>Intenta disimular y no levantar sospechas</p>
        </>
      )}

      <button onClick={handleStart}>
        Empezar partida
      </button>
    </div>
  );
};

export default RevealPage;
