import { ComponentType, memo, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Routes } from "../navigation/routes";

export default function withAuth(Component: ComponentType<any>) {
  return memo((props) => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (loading) return;

      if (user) {
        navigate(Routes.admin.path + Routes.admin.routes.students.path, { replace: true });
      } else {
        navigate(Routes.public.path + Routes.public.routes.signin.path, {
          replace: true,
        });
      }
    }, [navigate, user, loading]);

    return <Component {...props} />;
  });
}
