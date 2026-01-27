import { Routes, Route } from "react-router-dom";

import Layout from "./application/components/layout";

import HomePage from "./pages/home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import LobbyPage from "./pages/lobby";
import GamePage from "./pages/game";
import RoomPage from "./pages/room";
import Profile from "./pages/profile";
import NotFound from "./pages/notFound";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/game/:roomId" element={<GamePage />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/notFound" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
