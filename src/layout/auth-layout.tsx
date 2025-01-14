import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Routes } from "../navigation/routes";
import { Outlet } from "react-router-dom"; // Necesario para renderizar las rutas hijas

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return; // Espera a que el estado de carga termine

    if (user) {
      navigate(Routes.admin.path + Routes.admin.routes.students.path, {
        replace: true,
      }); // Redirigir a admin si está autenticado
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar algo mientras se verifica el estado de autenticación
  }

  return <Outlet />; // Aquí renderizamos las rutas hijas una vez que se termine el proceso de autenticación
}
