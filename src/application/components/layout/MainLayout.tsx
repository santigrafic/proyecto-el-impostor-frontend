import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export default function MainLayout() {
  const location = useLocation()

  // Ocultar header en la home
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
