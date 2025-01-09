import SearchEntitie from "../pages/public/search-entitie/search-entitie";
import ViewCertificate from "../pages/public/view-certificate/view-certificate";
import MainLayout from "../layout/mainLayout";

export const Routes = {
  admin: {
    path: "/admin/",
    layout: MainLayout,
    routes: {
      dashboard: {
        title: "administrador",
        path: "",
        element: "",
      },
      task: {
        title: "tareas",
        path: "task",
        element: "",
      },
    },
  },
  public: {
    path: "/",
    layout: MainLayout,
    routes: {
      search: {
        title: "consulta",
        path: "",
        element: SearchEntitie,
      },
      view_certificate: {
        title: "certificados",
        path: "certificados",
        element: ViewCertificate,
      },
    },
  },
};
