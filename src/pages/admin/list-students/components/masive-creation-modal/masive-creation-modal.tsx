import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalProps,
} from "@nextui-org/modal";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function MasiveCreationModal({
  ...props
}: Omit<ModalProps, "children">) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState(null);
  const [jsonData, setJsonData] = useState("");
  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(JSON.stringify(json, null, 2));
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
      <Modal {...props}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Creacion Masiva de Certificados
              </ModalHeader>
              <ModalBody>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button onClick={handleConvert}>Convert</button>
                <pre>{jsonData.length}</pre>
                <pre>{jsonData}</pre>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
  );
}
