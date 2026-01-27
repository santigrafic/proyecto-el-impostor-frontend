import React from 'react'
import { Route, Routes } from "react-router-dom";

import { appRoutes } from "./utils/app-routes";

const RoutesComponent: React.FC = () => {
  return (
    <Routes>
      {appRoutes.map((route) => (
        <Route key={route.key} path={route.path} element={route.element} />
      ))}
    </Routes>
  )
}

export default RoutesComponent