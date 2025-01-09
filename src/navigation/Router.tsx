import {
  createBrowserRouter,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { Routes } from "./routes";
//import PageNotFound from "../page/PageNotFound";

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
    element: (
      <div className="w-screen">
        <Outlet />
      </div>
    ),
    children: [
      ...RouteObjects,
      {
        path: "*",
        element: <div>LA RUTA NO EXISTE</div>,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
