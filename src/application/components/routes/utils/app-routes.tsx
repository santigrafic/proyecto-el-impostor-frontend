//import React from "react";

import { Navigate } from "react-router-dom";

import HomePage from "../../../../pages/home";
import Login from "../../../../pages/login/Login";
import Register from "../../../../pages/register/Register";
import Lobby from "../../../../pages/lobby/Lobby";
import Room from "../../../../pages/room/Room";
import RevealPage from "../../../../pages/reveal-page/RevealPage";
import Game from "../../../../pages/game/Game";
import NotFound from "../../../../pages/not-found/NotFound";

import { ROUTE_PATHS } from "./route-paths";

import type { RouteTypes } from "./types";

export const appRoutes: RouteTypes[] = [
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
    key: "reveal-page",
    path: ROUTE_PATHS.REVEALPAGE,
    element: <RevealPage />,
  },
  {
    key: "game",
    path: ROUTE_PATHS.GAME,
    element: <Game />,
  },
  {
    key: "not-found",
    path: ROUTE_PATHS.NOTFOUND,
    element: <NotFound />,
  },
  {
    key: "default",
    path: ROUTE_PATHS.DEFAULT,
    element: <Navigate to={ROUTE_PATHS.HOME} replace />,
  },
];
