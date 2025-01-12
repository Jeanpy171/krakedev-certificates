import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@nextui-org/modal";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function MasiveCreationModal({
  ...props
}: Omit<ModalProps, "children">) {
  const [file, setFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<unknown[]>([]); // Asegúrate de que sea un arreglo

  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;
        const data = e.target.result as string; // Asegúrate de que es una cadena
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet); // Esto genera un arreglo de objetos
        setJsonData(json); // Guarda el arreglo directamente
      };
      reader.readAsBinaryString(file);
    }
  };

  useEffect(() => {
    if (Array.isArray(jsonData)) {
      console.log("DATOS:", jsonData);
      jsonData.map((item, index) => console.log(`Elemento ${index}:`, item));
    } else {
      console.warn("jsonData no es un arreglo");
    }
  }, [jsonData]);

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
                onChange={(e) =>
                  setFile(e.target.files ? e?.target?.files[0] : null)
                }
              />
              <Button onClick={handleConvert}>Convert</Button>
              <pre>{jsonData.length}</pre>
              <pre>{JSON.stringify(jsonData, null, 2)}</pre>
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
