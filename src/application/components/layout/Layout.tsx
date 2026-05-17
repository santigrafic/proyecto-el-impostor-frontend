import { Outlet, useLocation } from 'react-router-dom'

import Header from './components/header'
import Footer from './components/footer'
import GameHeader from './components/game-header'

import { appRoutes } from '../routes/utils/app-routes'

import type { LayoutTypes } from './utils/types'

import "./Layout.css"

const Layout = ({ children }: LayoutTypes) => {
  const location = useLocation()

  const currentRoute = appRoutes.find((route) => route.path === location.pathname || location.pathname.includes(route.key))

  return (
    <div className="main-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!currentRoute?.hideHeader && !currentRoute?.gameHeader && <Header />}
      {currentRoute?.gameHeader && <GameHeader />}


      <main style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Outlet />
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default Layout