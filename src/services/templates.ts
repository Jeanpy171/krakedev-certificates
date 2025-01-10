import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { Template } from "../interface/template";

export const handleGetAllTemplates = async (): Promise<Template[]> => {
  try {
    const filter = query(collection(db, "templates"))
    const querySnapshot = await getDocs(filter)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Template[]
  } catch (error) {
    console.log("Error al traer todas las plantillas")
    throw error
  }
};

// export const handleGetStudentByEmail = async (email: string) => {
//   if (!email) {
//     throw new Error("Debes proporcionar el email");
//   }

//   try {
//     const filter = query(collection(db, "students"), where("email", "==", email))
//     const querySnapshot = await getDocs(filter)
//     if (querySnapshot.empty) throw new Error("No se ha encontrado el correo electronico")
//     const { id, data } = querySnapshot.docs[0]
//     const studentDocument = { id, ...data() }
//     return studentDocument
//   } catch (error) {
//     console.log("Error al consultar la info del estudiante")
//     throw error
//   }
// }

