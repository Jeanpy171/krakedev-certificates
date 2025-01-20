import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Inicializa loading en true

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.warn("usuario cuando entra: ", user);
      setUser(user); // Establecer el usuario autenticado
      setLoading(false); // Cambiar loading a false cuando se haya verificado el usuario
    });

    // Limpiar la suscripción cuando el componente se desmonte
    return unsubscribe;
  }, []);

  return { user, loading };
}
