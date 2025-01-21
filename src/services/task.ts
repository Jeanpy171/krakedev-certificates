/* eslint-disable no-useless-catch */
import { collection, getDocs, query, where } from "firebase/firestore";
import { Student } from "../interface/student";
import { db } from "../firebase";

export const handleGetAllTasks = async (): Promise<Student[]> => {
  try {
    const filter = query(
      collection(db, "students"),
      where("status", "==", "pending")
    );
    const querySnapshot = await getDocs(filter);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
  } catch (error) {
    //console.log("Error al traer las tareas");
    throw error;
  }
};
