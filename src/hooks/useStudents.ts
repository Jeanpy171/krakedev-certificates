import { useState, useCallback } from "react";
import { Student } from "../interface/student";
import { handleGetStudentsWithPagination, handleGetAllStudentsByFullname } from "../services/students";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDocument, setLastDocument] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Obtener estudiantes con paginación
  const fetchStudentsWithPagination = useCallback(
    async (limitNumber: number) => {
      if (!hasMore || isSearching) return;  // Evitar la carga si ya no hay más o si estamos buscando

      setIsLoading(true);
      try {
        const { students: newStudents, lastDocument: newLastDocument } = await handleGetStudentsWithPagination(limitNumber, lastDocument);

        setStudents((prev) => {
          const existingIds = new Set(prev.map((student) => student.id));
          const filteredStudents = newStudents.filter((student) => !existingIds.has(student.id));
          return [...prev, ...filteredStudents];
        });

        setLastDocument(newLastDocument as QueryDocumentSnapshot<DocumentData>);
        if (!newLastDocument || newStudents.length < limitNumber) {
          setHasMore(false); // Si no hay más estudiantes, desactivar la paginación
        }
      } catch (error) {
        console.error("Error al cargar estudiantes con paginación:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasMore, isSearching, lastDocument]
  );

  // Buscar estudiantes por nombre
  const searchStudents = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        // Limpiar la lista solo si no hay término de búsqueda
        setStudents([]);
        setLastDocument(undefined);
        setHasMore(true); // Reestablecer la paginación
        return;
      }

      setIsLoading(true);
      setIsSearching(true);
      try {
        const filteredStudents = await handleGetAllStudentsByFullname(searchTerm.toUpperCase());
        setStudents(filteredStudents); // Establecer los estudiantes filtrados
        setHasMore(false); // No cargar más resultados
      } catch (error) {
        console.error("Error al buscar estudiantes:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    []
  );

  const handleUpdateStudents = (students: Student[]) => {
    setStudents(students); // Actualiza los estudiantes
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
