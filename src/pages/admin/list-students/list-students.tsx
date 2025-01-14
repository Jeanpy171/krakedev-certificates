import { Button } from "@nextui-org/button";
import TableStudent from "./components/table-students/table-students";
import { useDisclosure } from "@nextui-org/modal";
import MasiveCreationModal from "./components/masive-creation-modal/masive-creation-modal";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import StudentModal from "./components/student-modal/student-modal";
import useCertificateStore from "../../../store/certificates";
import { Toaster } from "sonner";
import { useDebounce } from "../../../hooks/useDebounce";
import { useStudents } from "../../../hooks/useStudents";
import { Student } from "../../../interface/student";

export const ListStudents = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [student, setStudent] = useState<Student | null>(null);
  const {
    students,
    isLoading,
    hasMore,
    fetchStudentsWithPagination,
    searchStudents,
  } = useStudents();

  const [searchName, setSearchName] = useState<string>("");
  const debouncedSearchName = useDebounce(searchName, 500);
  const { fetchCertificates, isLoadingCertificates, errorCertificates } =
    useCertificateStore();

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  useEffect(() => {
    console.warn("DEOUNCE EN PAGINATION: ", debouncedSearchName);
    if (debouncedSearchName === null || debouncedSearchName === "") {
      fetchStudentsWithPagination(10);
    }
  }, [debouncedSearchName, fetchStudentsWithPagination]);

  useEffect(() => {
    console.warn("DEOUNCE: ", debouncedSearchName);
    searchStudents(debouncedSearchName);
  }, [debouncedSearchName, searchStudents]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(e.target.value);
  };

  if (isLoadingCertificates) return <p>Cargando estudiantes...</p>;
  if (errorCertificates) return <p>Error: {errorCertificates}</p>;

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
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        size="5xl"
      />
      <StudentModal
        data={student}
        isOpen={student ? true : false}
        onClose={() => setStudent(null)}
        scrollBehavior="inside"
        size="5xl"
      />
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
