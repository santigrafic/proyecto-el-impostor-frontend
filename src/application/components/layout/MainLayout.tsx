import { Outlet } from 'react-router-dom'

export default function MainLayout() {
  return (
    <div className="main-layout">
      <header className="navbar navbar-dark bg-dark mb-4">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Juego El Impostor
          </span>
        </div>
      </header>

      <main>
        <Outlet /> {/* 👈 AQUÍ se cargan las páginas */}
      </main>

      <footer className="app-footer">
        <div className="container">
          © {new Date().getFullYear()} · Juego El Impostor · David Santiago Gavilan
        </div>
      </footer>
    </div>
  )
}
