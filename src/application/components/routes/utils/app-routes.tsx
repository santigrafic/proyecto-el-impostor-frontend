import { Navigate } from "react-router-dom";

import WelcomePage from "../../../../pages/welcome";
import HomePage from "../../../../pages/home";
import Login from "../../../../pages/login/Login";
import Register from "../../../../pages/register/Register";
import Profile from "../../../../pages/profile/Profile";
import Ranking from "../../../../pages/ranking/Ranking";
import Lobby from "../../../../pages/lobby/Lobby";
import Room from "../../../../pages/room/Room";
import Game from "../../../../pages/game/Game";

import { ROUTE_PATHS } from "./route-paths";

import type { RouteTypes } from "./types";

export const appRoutes: RouteTypes[] = [
  {
    key: "welcome",
    path: ROUTE_PATHS.WELCOME,
    element: <WelcomePage  />,
    hideHeader: true,
  },
  {
    key: "home",
    path: ROUTE_PATHS.HOME,
    element: <HomePage />,
    hideHeader: true,
  },
  {
    key: "login",
    path: ROUTE_PATHS.LOGIN,
    element: <Login />,
  },
  {
    key: "register",
    path: ROUTE_PATHS.REGISTER,
    element: <Register />,
  },
  {
    key: "profile",
    path: ROUTE_PATHS.PROFILE,
    element: <Profile />,
  },
  {
    key: "ranking",
    path: ROUTE_PATHS.RANKING,
    element: <Ranking />,
  },
  {
    key: "lobby",
    path: ROUTE_PATHS.LOBBY,
    element: <Lobby />,
  },
  {
    key: "room",
    path: ROUTE_PATHS.ROOM,
    element: <Room />,
  },
  {
    key: "game",
    path: ROUTE_PATHS.GAME,
    element: <Game />,
    gameHeader: true,
  },
  {
    key: "default",
    path: ROUTE_PATHS.DEFAULT,
    element: <Navigate to={ROUTE_PATHS.HOME} replace />,
  },
];
