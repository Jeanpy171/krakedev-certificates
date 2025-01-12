import { Button } from "@nextui-org/button";
import TableStudent from "./components/table-students/table-students";
import { useDisclosure } from "@nextui-org/modal";
import MasiveCreationModal from "./components/masive-creation-modal/masive-creation-modal";
import { Input } from "@nextui-org/input";
import { useEffect, useState } from "react";
import { Student } from "../../../interface/student";
import StudentModal from "./components/action-modal/student-modal";

export const ListStudents = () => {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    console.warn(student);
  }, [student]);

  return (
    <main className="p-5 flex flex-col gap-5">
      <article className="flex gap-5">
        <Input placeholder="Busca el nombre del estudiante" />
        <Button onClick={onOpen}>Crear de forma masiva</Button>
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
      <TableStudent handleOnChange={setStudent} />
    </main>
  );
};
