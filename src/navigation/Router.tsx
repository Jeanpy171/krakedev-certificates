import { createBrowserRouter, RouterProvider, Outlet, RouteObject } from "react-router-dom";
import { Routes } from "./routes";
import AuthLayout from "../layout/auth-layout";

const RouteObjects: Array<RouteObject> = Object.values(Routes).map((e) => ({
  path: e.path,
  element: (
    <e.layout>
      <Outlet />
    </e.layout>
  ),
  children: Object.values(e.routes).map((r) => ({
    path: r.path,
    element: <r.element />,
  })),
}));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />, 
    children: [
      ...RouteObjects,
      {
        path: "*",
        element: <div>La ruta no existe</div>,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
