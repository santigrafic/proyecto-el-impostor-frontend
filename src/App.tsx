import { Routes, Route } from 'react-router-dom'
import MainLayout from './application/components/layout/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Lobby from './pages/Lobby'

function App() {
  return (
    <Routes>
        <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/lobby" element={<Lobby />} />
      </Route>
    </Routes>
  )
}

export default App
