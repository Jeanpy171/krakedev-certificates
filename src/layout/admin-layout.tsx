import { ReactNode, useEffect } from "react";
import MainNavbar from "../components/navbar/navbar";
import CustomSidebar from "../components/sidebar/sidebar";
import { Routes } from "../navigation/routes";

const AdminLayout = (props: { children: ReactNode }) => {
  const handleGetAdminRoutes = () => {
    const entries = Object.values(Routes.admin.routes);
    console.warn("ENTRADAS EN ADMIN: ", entries);
    const routes = entries.map((entry) => ({
      path: entry.path,
      title: entry.title,
    }));
    return routes;
  };

  const routes = handleGetAdminRoutes();
  
  return (
    <div className="h-screen flex flex-col">
      <MainNavbar />
      <div className="flex">
        <CustomSidebar routes={routes} />
        <div className="flex-1 h-dvh">{props.children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
