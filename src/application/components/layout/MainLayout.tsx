import type { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="app-container">
      <header className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            Juego El Impostor
          </span>
        </div>
      </header>

      <main className="main-content container">
        {children}
      </main>

      <footer className="app-footer">
        <div className="container">
          © {new Date().getFullYear()} · Juego El Impostor · David Santiago Gavilan
        </div>
      </footer>
    </div>
  )
}

export default MainLayout
