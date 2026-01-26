import type React from "react"

import "./Footer.css"

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="container">
        © {new Date().getFullYear()} · Juego El Impostor · David Santiago Gavilan
      </div>
    </footer>
  )
}

export default Footer
