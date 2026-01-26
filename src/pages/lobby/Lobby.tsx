import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LobbyPage: React.FC = () => {
  const navigate = useNavigate()
  const [codigo, setCodigo] = useState('')
  const isGuest = localStorage.getItem('userType') === 'guest'

  const handleCrearPartida = () => {
    // Aquí iría la llamada al backend para crear partida
    const partidaID = Math.floor(Math.random() * 9000 + 1000) // ejemplo de código
    alert(`Partida creada: ${partidaID}`)
    // Luego redirigir al jugador a la sala
    navigate(`/game/${partidaID}`)
  }

  const handleUnirsePartida = () => {
    if (!codigo) {
      alert('Introduce un código de partida')
      return
    }
    // Aquí validarías el código con el backend
    alert(`Uniéndote a la partida ${codigo}`)
    navigate(`/game/${codigo}`)
  }

  return (
    <div className="lobby-container" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center' }}>
      <h2>Sala de Juego</h2>
      <p>Bienvenido al juego El Impostor</p>

      <div className="crear-partida" style={{ margin: '20px 0' }}>
        <button
          className="btn btn-success"
          onClick={handleCrearPartida}
          style={{ width: '400px', padding: '10px', fontSize: '16px' }}
        >
          Crear partida
        </button>
      </div>

      <div className="unirse-partida" style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Introduce código de partida"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          style={{ width: '70%', padding: '8px', fontSize: '16px', marginRight: '5px' }}
        />
        <button
          className="btn btn-primary"
          onClick={handleUnirsePartida}
          style={{ padding: '8px 12px', fontSize: '16px' }}
        >
          Unirse
        </button>
      </div>
    </div>
  )
}

export default LobbyPage
