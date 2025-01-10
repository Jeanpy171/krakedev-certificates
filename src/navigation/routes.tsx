import SearchEntitie from "../pages/public/search-entitie/search-entitie";
import ViewCertificate from "../pages/public/view-certificate/view-certificate";
import MainLayout from "../layout/mainLayout";
import withAuth from "../hoc/withAuth";
import SignIn from "../pages/public/sign-in/sign-in";
import { ListStudents } from "../pages/admin/list-students/list-students";
import { Templates } from "../pages/admin/templates/templates";

export const Routes = {

  admin: {
    path: "/admin/",
    layout: withAuth(MainLayout),
    routes: {
      dashboard: {
        title: "administrador",
        path: "",
        element: ListStudents,
      },
      task: {
        title: "tareas",
        path: "task",
        element: (() => <div>Tareas</div>),
      },
      templates:{
        title: "Plantillas",
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
