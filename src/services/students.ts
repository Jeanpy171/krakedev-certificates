import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { Student } from "../interface/student";
import { db } from "../firebase";
import { CreateStudent } from "../pages/admin/list-students/components/masive-creation-modal/masive-creation-modal";

export const handleGetAllStudents = async (): Promise<Student[]> => {
  // eslint-disable-next-line no-useless-catch
  try {
    const filter = query(collection(db, "students"));
    const querySnapshot = await getDocs(filter);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
  } catch (error) {
    //console.log("Error al traer los estudiantes");
    throw error;
  }
};

export const handleGetStudentsWithPagination = async (
  limitNumber: number,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{
  students: Student[];
  lastDocument: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  // eslint-disable-next-line no-useless-catch
  try {
    let filter;
    if (lastDoc) {
      filter = query(
        collection(db, "students"),
        startAfter(lastDoc),
        limit(limitNumber)
      );
    } else {
      filter = query(collection(db, "students"), limit(limitNumber));
    }

    const querySnapshot = await getDocs(filter);
    const students = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Student[];
    const lastDocument =
      querySnapshot.docs[querySnapshot.docs.length - 1] || null;

    return { students, lastDocument };
  } catch (error) {
    //console.error("Error al obtener los estudiantes con paginación:", error);
    throw error;
  }
};

export const handleGetStudentByEmail = async (
  email: string
): Promise<Student | null> => {
  if (!email) {
    throw new Error("Debes proporcionar el email");
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const filter = query(
      collection(db, "students"),
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(filter);
    if (querySnapshot.empty) {
      return null;
    }

    const document = querySnapshot.docs[0];
    const id = document.id;
    const data = document.data() as Partial<Student>;

    if (!data.fullname || !data.email || !data.certificates) {
      throw new Error("Datos incompletos en el documento de Firestore");
    }

    const studentDocument = {
      id,
      ...data,
    } as Student;

    return studentDocument;
  } catch (error) {
    //console.error("Error al consultar la información del estudiante:", error);
    throw error;
  }
};

export const handleGetAllStudentsByFullname = async (
  searchTerm: string
): Promise<Student[]> => {
  try {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const studentsRef = collection(db, "students");

    const queries = [
      query(studentsRef, where("fullname", ">=", searchTerm)),
      query(studentsRef, where("fullname", "<", searchTerm + "\uf8ff")),
    ];

    const results: Student[] = [];

    for (const q of queries) {
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Student, "id">;
        if (data.fullname.toLowerCase().includes(normalizedSearchTerm)) {
          results.push({
            id: doc.id,
            ...data,
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error("Error al traer los estudiantes", error);
    throw error;
  }
};

export const handleCreateStudent = async (
  student: CreateStudent
): Promise<string> => {
  if (!student || !student.email || !student.certificate) {
    throw new Error("Debe proporcionar la información completa del estudiante");
  }

  // eslint-disable-next-line no-useless-catch
  try {
    const existingStudent = await handleGetStudentByEmail(student.email);

    if (existingStudent) {
      const certificateIndex = existingStudent.certificates?.findIndex(
        (cert) => cert.id_certificate === student?.certificate?.id_certificate
      );

      const updatedCertificates = existingStudent.certificates || [];
      if (certificateIndex !== undefined && certificateIndex !== -1) {
        updatedCertificates[certificateIndex] = { ...student.certificate };
      } else {
        updatedCertificates.push(student.certificate);
      }

      await handleUpdateStudent(existingStudent.id, {
        certificates: updatedCertificates,
      });
      return existingStudent.id;
    }

    const studentRef = doc(db, "students", student.id);

    const addCertificatesStudent = {
      ...student,
      certificates: [student.certificate],
    };
    delete addCertificatesStudent.certificate;

    await setDoc(studentRef, addCertificatesStudent);

    return student.id;
  } catch (error) {
    //console.error("Error al crear o actualizar estudiante:", error);
    throw error;
  }
};

export const handleUpdateStudent = async (
  id: string,
  updateStudent: Partial<Student> & { [key: string]: unknown }
): Promise<void> => {
  if (!id || !updateStudent) {
    throw new Error("ID y datos actualizados son obligatorios");
  }

  try {
    const studentRef = doc(db, "students", id);
    await updateDoc(studentRef, updateStudent);
  } catch (error) {
    throw new Error(
      `Error al actualizar los datos del estudiante: ${
        error instanceof Error ? error.message : "desconocido"
      }`
    );
  }
};

export const handleDeleteStudent = async (id: string): Promise<void> => {
  // eslint-disable-next-line no-useless-catch
  try {
    await deleteDoc(doc(db, "students", id));
  } catch (error) {
    //console.error("Error al eliminar el estudiante:", error);
    throw error;
  }
};
