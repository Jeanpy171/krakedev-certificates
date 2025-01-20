import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Routes } from "../navigation/routes";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Asegurarse de que no se haga redirección antes de que se haya terminado la carga de los datos
    if (!loading && user) {
      // Redirigir al usuario al path de estudiantes si está autenticado
      navigate(Routes.admin.path + Routes.admin.routes.students.path, {
        replace: true,
      });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return <Outlet />;
}
