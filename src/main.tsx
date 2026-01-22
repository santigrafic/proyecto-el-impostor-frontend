import { createRoot } from 'react-dom/client'
import './styles/global.css'
import Home from './pages/Home.tsx'
import MainLayout from './application/components/layout/MainLayout.tsx'

createRoot(document.getElementById('root')!).render(
  <MainLayout>
    <Home />
  </MainLayout>,
)
