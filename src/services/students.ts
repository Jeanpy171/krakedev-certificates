import { Student } from "../interface/student";
import { students } from "./students.mock";

export const searchByEmail = async (email: string): Promise<Student> => {
  if (!email) {
    throw new Error("Email must be provided");
  }

  try {
    const studentsCollection = await handleFetchStudents();
    const data = studentsCollection.find((student) => student.email === email);
    console.log("DATA ENCONTRADA: ", data);
    if (data) return data;

    throw new Error("Email doesn't exist in DB");
  } catch (error) {
    console.error("Error in searchByEmail:", error);
    throw error;
  }
};

const handleFetchStudents = async (): Promise<Student[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(students);
    }, 3500);
  });
};
