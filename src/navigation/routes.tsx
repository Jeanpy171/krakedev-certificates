import SearchEntitie from "../pages/public/search-entitie/search-entitie";
import ViewCertificate from "../pages/public/view-certificate/view-certificate";
import MainLayout from "../layout/mainLayout";
import withAuth from "../hoc/withAuth";
import SignIn from "../pages/public/sign-in/sign-in";
import { ListStudents } from "../pages/admin/list-students/list-students";
import { Templates } from "../pages/admin/templates/templates";
import AdminLayout from "../layout/admin-layout";

export const Routes = {

  admin: {
    path: "/admin/",
    layout: withAuth(AdminLayout),
    routes: {
      dashboard: {
        title: "Registros",
        path: "",
        element: ListStudents,
      },
      task: {
        title: "Tareas",
        path: "task",
        element: (() => <div>Tareas</div>),
      },
      templates:{
        title: "Certificaciones",
        path: "templates",
        element: Templates,
      }
      
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
      signin:{
        title: "acceder",
        path: "signin",
        element: SignIn,
      }
    },
  },
};
