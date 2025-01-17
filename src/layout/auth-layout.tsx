import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Routes } from "../navigation/routes";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user) {
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
