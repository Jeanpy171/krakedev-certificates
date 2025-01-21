/* eslint-disable no-useless-catch */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const handleLogout = async () => { 
  try {
    await signOut(auth);
  } catch (error) {
    //console.error("Error logging out:", error);
  }
};

export const handleLogin = async (email: string, password: string) => {
  if (!email || !password)
    throw new Error("Necesitas proporcionar usuario y contrasenia");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    //console.log("User logged in successfully");
  } catch (error) {
    //console.error("Error logging in:", error);
    throw error;
  }
};
