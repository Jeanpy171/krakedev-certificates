import { Button } from "@nextui-org/button";
import TableStudent from "./components/table-students/table-students";
import { useDisclosure } from "@nextui-org/modal";
import MasiveCreationModal from "./components/masive-creation-modal/masive-creation-modal";
import { Input } from "@nextui-org/input";
import { useEffect, useRef, useState } from "react";
import StudentModal from "./components/student-modal/student-modal";
import useCertificateStore from "../../../store/certificates";
import { toast, Toaster } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";
import { useStudents } from "../../../hooks/useStudents";
import { Student } from "../../../interface/student";
import { handleDeleteStudent } from "../../../services/students";

export const ListStudents = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [student, setStudent] = useState<Student | null>(null);
  const {
    students,
    isLoading,
    hasMore,
    fetchStudentsWithPagination,
    handleUpdateStudents,
    searchStudents,
  } = useStudents();

  const [searchName, setSearchName] = useState<string>("");
  const debouncedSearchName = useDebounce(searchName, 500);
  const { fetchCertificates, isLoadingCertificates } = useCertificateStore();

  const initialLoadRef = useRef(false); // Controla si la carga inicial ya ocurrió
  const searchRef = useRef(""); // Evita múltiples llamadas a `searchStudents`

  useEffect(() => {
    // Carga inicial de estudiantes
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      fetchStudentsWithPagination(10);
    }
  }, [fetchStudentsWithPagination]);

  useEffect(() => {
    // Lógica de búsqueda
    const performSearch = async () => {
      const trimmedSearchName = debouncedSearchName.trim();

      // Verificar si el término de búsqueda ha cambiado
      if (trimmedSearchName !== searchRef.current) {
        searchRef.current = trimmedSearchName;

        // Llamar a searchStudents para que se maneje la búsqueda y la paginación
        await searchStudents(trimmedSearchName);
      }
    };

    // Ejecutar la búsqueda cuando cambie el término de búsqueda
    performSearch();
  }, [debouncedSearchName, searchStudents]);

  useEffect(() => {
    // Cargar certificados al montar el componente
    fetchCertificates();
  }, [fetchCertificates]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value); // Actualizar valor del campo de búsqueda
    setStudent(null); // Reiniciar estudiante seleccionado
  };

  const handleDeleteStudentModal = async (id: string) => {
    try {
      await handleDeleteStudent(id);
      const updateStudents = students.filter((student) => student.id !== id);
      handleUpdateStudents(updateStudents);
      toast.success("Estudiante eliminado correctamente");
      setStudent(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar el estudiante");
      throw error;
    }
  };

  const handleUpdateStudentData = (
    id: string,
    updateData: Partial<Student>
  ) => {
    const updateStudents = [...students];
    const studentIndex = updateStudents.findIndex(
      (student) => student.id === id
    );
    updateStudents[studentIndex] = {
      ...updateStudents[studentIndex],
      ...updateData,
    };
    handleUpdateStudents(updateStudents);
  };

  const handleUpdateMasiveStudents = () => {
    fetchStudentsWithPagination(10);
  };

  if (isLoadingCertificates)
    return (
      <article className="w-full h-full flex justify-center items-center">
        <p>Cargando...</p>
      </article>
    );

  return (
    <main className="p-5 flex flex-col gap-5">
      <Toaster />
      <article className="flex gap-5">
        <Input
          placeholder="Busca el nombre del estudiante"
          onChange={handleSearch}
          value={searchName}
        />
        <Button color="warning" size="md" onPress={onOpen}>
          Crear de forma masiva
        </Button>
      </article>
      <MasiveCreationModal
        isOpen={isOpen}
        handleUpdateMasiveStudents={handleUpdateMasiveStudents}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
      />
      {student && (
        <StudentModal
          data={student}
          isOpen={!!student}
          onClose={() => setStudent(null)}
          handleDeleteStudent={handleDeleteStudentModal}
          handleUpdateStudentData={handleUpdateStudentData}
          scrollBehavior="inside"
          size="5xl"
        />
      )}

      <section className="flex justify-center items-center">
        {isLoading ? (
          <h4>Cargando ...</h4>
        ) : (
          <TableStudent
            data={students}
            handleOnChange={setStudent}
            isLoading={isLoading}
            hasMore={hasMore}
            loadMore={() => fetchStudentsWithPagination(10)}
          />
        )}
      </section>
    </main>
  );
};
