import { Button } from "@nextui-org/button";
import TableStudent from "./components/table-students/table-students";
import { useDisclosure } from "@nextui-org/modal";
import MasiveCreationModal from "./components/masive-creation-modal/masive-creation-modal";

export const ListStudents = () => {
    const { onOpenChange } = useDisclosure();
  return (
    <main className="p-5">
        <MasiveCreationModal isOpen={true} onOpenChange={onOpenChange} scrollBehavior="inside" size="5xl"/>
        <Button>Crear de forma masiva</Button>
      <TableStudent />
    </main>
  );
};
