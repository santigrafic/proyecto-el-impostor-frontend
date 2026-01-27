import { Link, useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const navigate = useNavigate()

  const userType: string = localStorage.getItem('userType') ?? "guest"
  const userName: string = localStorage.getItem('userName') ?? "Guest"
  // TODO: Add default avatar
  const userAvatar: string = localStorage.getItem('userAvatar') ?? ""



  const handleLogout = () => {
    localStorage.clear()
    navigate('/lobby')
  }

  return (
    <header style={{ padding: '10px 20px', background: '#222', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
          El Impostor
        </Link>
      </h3>

      {userType === 'guest' && (
        <div>
          <button className="btn btn-outline-light" onClick={() => navigate('/login')} style={{ marginRight: '10px' }}>Login</button>
          <button className="btn btn-light" onClick={() => navigate('/register')}>Registro</button>
        </div>
      )}

      {userType === 'user' && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={userAvatar} alt="Avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', marginRight: '10px' }} />
          <span style={{ marginRight: '10px' }}>{userName}</span>
          <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
              Opciones
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li><button className="dropdown-item" onClick={() => navigate('/profile')}>Perfil</button></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
