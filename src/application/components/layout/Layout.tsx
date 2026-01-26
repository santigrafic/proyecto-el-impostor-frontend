import type React from 'react'

import { Outlet, useLocation } from 'react-router-dom'

import Header from './components/header'
import Footer from './components/footer'

import "./Layout.css"

const Layout: React.FC = () => {
  const location = useLocation()

  // Hide header
  const hideHeaderPaths = ['/', '/login', '/register']
  const hideHeader = hideHeaderPaths.includes(location.pathname)

  return (
    <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!hideHeader && <Header />}

      <main style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout