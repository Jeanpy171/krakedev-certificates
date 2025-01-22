import { ReactNode } from "react";
import MainNavbar from "../components/navbar/navbar";
import CustomSidebar from "../components/sidebar/sidebar";
import { Routes } from "../navigation/routes";
import { IoMdHome } from "react-icons/io";
import { LuLayoutTemplate, LuList } from "react-icons/lu";

const AdminLayout = (props: { children: ReactNode }) => {
  const handleGetAdminRoutes = () => {
    const modules = Object.entries(Routes.admin.routes).map(([key, value]) => ({
      title: value.title,
      icon: getIconForModule(key),
      path: value.path,
    }));
    return modules;
  };

  function getIconForModule(module: string) {
    switch (module) {
      case "dashboard":
        return IoMdHome;
      case "task":
        return LuList;
      case "templates":
        return LuLayoutTemplate;

      default:
        return IoMdHome;
    }
  }

  const routes = handleGetAdminRoutes();

  return (
    <div className="h-screen flex flex-col">
      <MainNavbar />
      <div className="flex flex-col md:flex-row flex-1">
        <CustomSidebar modules={routes} />
        <div className="flex-1 overflow-auto">
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
