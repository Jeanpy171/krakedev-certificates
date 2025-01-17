import { useState, useCallback } from "react";
import { Student } from "../interface/student";
import {
  handleGetStudentsWithPagination,
  handleGetAllStudentsByFullname,
} from "../services/students";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDocument, setLastDocument] = useState<
    QueryDocumentSnapshot<DocumentData> | undefined
  >(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchStudentsWithPagination = useCallback(
    async (limitNumber: number) => {
      if (!hasMore || isSearching) return;

      setIsLoading(true);
      try {
        const { students: newStudents, lastDocument: newLastDocument } =
          await handleGetStudentsWithPagination(limitNumber, lastDocument);

        setStudents((prev) => {
          const existingIds = new Set(prev.map((student) => student.id));
          const filteredStudents = newStudents.filter(
            (student) => !existingIds.has(student.id)
          );
          console.warn("ESTO RECIBO DE PAGINACION: ", filteredStudents);
          return [...prev, ...filteredStudents];
        });

        setLastDocument(newLastDocument as QueryDocumentSnapshot<DocumentData>);
        if (!newLastDocument || newStudents.length < limitNumber) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error al cargar estudiantes con paginación:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isSearching, lastDocument]
  );

  const searchStudents = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setStudents([]);
      setLastDocument(undefined);
      setHasMore(true);
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    try {
      const filteredStudents = await handleGetAllStudentsByFullname(
        searchTerm.toUpperCase()
      );
      setStudents(filteredStudents);
      setHasMore(false);
    } catch (error) {
      console.error("Error al buscar estudiantes:", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, []);

  const handleUpdateStudents = (students: Student[]) => {
    setStudents(students);
  };

  return {
    students,
    isLoading,
    hasMore,
    fetchStudentsWithPagination,
    searchStudents,
    handleUpdateStudents,
  };
}
