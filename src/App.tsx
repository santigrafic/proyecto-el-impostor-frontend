import { Routes, Route } from 'react-router-dom'

import Layout from './application/components/layout'

import HomePage from './pages/home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import LobbyPage from './pages/lobby'

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lobby" element={<LobbyPage />} />
      </Route>
    </Routes>
  )
}

export default App
