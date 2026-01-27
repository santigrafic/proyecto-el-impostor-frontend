import React from "react";

export type RouteTypes = {
  key: string;
  path: string;
  element: React.ReactNode;
  hideHeader?: boolean;
}