import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export const handleLogin = async (email: string, password: string) => {
  if (!email || !password)
    throw new Error("Necesitas proporcionar usuario y contrasenia");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully");
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
