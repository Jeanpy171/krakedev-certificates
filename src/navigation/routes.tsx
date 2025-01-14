import SearchEntitie from "../pages/public/search-entitie/search-entitie";
import ViewCertificate from "../pages/public/view-certificate/view-certificate";
import MainLayout from "../layout/mainLayout";
import withAuth from "../hoc/withAuth";
import SignIn from "../pages/public/sign-in/sign-in";
import { ListStudents } from "../pages/admin/list-students/list-students";
import AdminLayout from "../layout/admin-layout";
import { Certificates } from "../pages/admin/certificates/certificates";
import Task from "../pages/admin/tasks/task";

export const Routes = {
  admin: {
    path: "/admin/",
    layout: withAuth(AdminLayout),
    routes: {
      students: {
        title: "Estudiantes",
        path: "students",
        element: ListStudents,
      },
      task: {
        title: "Tareas",
        path: "task",
        element: Task,
      },
      templates: {
        title: "Certificaciones",
        path: "certificates",
        element: Certificates,
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
      signin: {
        title: "acceder",
        path: "signin",
        element: SignIn,
      },
    },
  },
};
