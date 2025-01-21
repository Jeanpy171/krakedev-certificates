import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { useCallback, useState } from "react";
import {
  handleGetAllStudentsByFullname,
  handleGetStudentsWithPagination,
} from "../services/students";
import { Student } from "../interface/student";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastDocument, setLastDocument] =
    useState<QueryDocumentSnapshot<DocumentData>>();
  const [hasMore, setHasMore] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const fetchStudentsWithPagination = useCallback(
    async (limitNumber: number, hasMoreElements?: boolean) => {
      const more = hasMoreElements ?? hasMore;
      if (!more || isSearching) return;
      setIsLoading(true);
      try {
        const { students: newStudents, lastDocument: newLastDocument } =
          await handleGetStudentsWithPagination(limitNumber, lastDocument);

        setStudents((prev) => {
          const existingIds = new Set(prev.map((student) => student.id));
          const filteredStudents = newStudents.filter(
            (student) => !existingIds.has(student.id)
          );
          return [...prev, ...filteredStudents];
        });

        setLastDocument(newLastDocument as QueryDocumentSnapshot<DocumentData>);
        setHasMore(newStudents.length === limitNumber);
      } catch (error) {
        //console.error("Error al cargar estudiantes con paginación:", error);
        throw new Error("Error al cargar estudiantes con paginación:" + error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isSearching, lastDocument]
  );

  const searchStudents = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setStudents([]);
        setHasMore(true);
        setLastDocument(undefined);
        fetchStudentsWithPagination(10, true);
        return;
      }

      setIsLoading(true);
      setIsSearching(true);
      try {
        const filteredStudents = await handleGetAllStudentsByFullname(
          searchTerm.toUpperCase()
        );
        setStudents(filteredStudents);
        setLastDocument(undefined);
        setHasMore(false);
      } catch (error) {
        //console.error("Error al buscar estudiantes:", error);
        throw new Error("Error al buscar estudiantes:" + error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [fetchStudentsWithPagination]
  );

  const handleUpdateStudents = useCallback((students: Student[]) => {
    setStudents(students);
  }, []);

  return {
    students,
    isLoading,
    hasMore,
    fetchStudentsWithPagination,
    searchStudents,
    handleUpdateStudents,
  };
}
