import React from "react"

import { Navigate } from "react-router-dom";

import HomePage from "../../../../pages/home"
import Login from "../../../../pages/login/Login"

import { ROUTE_PATHS } from "./route-paths";

import type { RouteTypes } from "./types"

export const appRoutes: RouteTypes[] = [
  {
    key: 'home',
    path: ROUTE_PATHS.HOME,
    element: <HomePage />,
    hideHeader: true
  },
  {
    key: 'login',
    path: ROUTE_PATHS.LOGIN,
    element: <Login />,
  },
  {
    key: 'default',
    path: ROUTE_PATHS.DEFAULT,
    element: <Navigate to={ROUTE_PATHS.HOME} replace />
  }
]