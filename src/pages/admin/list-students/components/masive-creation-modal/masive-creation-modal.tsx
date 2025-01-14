import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@nextui-org/modal";
import { useState } from "react";
import * as XLSX from "xlsx";
import { Student } from "../../../../../interface/student";
import { v4 as uuidv4 } from "uuid";
import { InputCertificates } from "../../../certificates/components/input-certificate/input-certificate";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import { handleCreateStudent } from "../../../../../services/students";
import { Timestamp } from "firebase/firestore";
import { getCurrentDate } from "../../../../../utils/date";

interface ExcelRow {
  DIPLOMA: string;
  EMAIL: string;
  ESTUDIANTES: string;
}

export interface CreateStudent extends Omit<Student, "certificates"> {
  certificate?: {
    name: string;
    range: string;
    id_certificate: string;
    id_template: string;
    created_at: Timestamp;
  };
}

export default function MasiveCreationModal({
  ...props
}: Omit<ModalProps, "children">) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<CreateStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleConvert = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;

        const data = e.target.result as string;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Leer el Excel como un arreglo tipado
        const rawJson: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);

        // Filtrar y transformar los datos
        const studentsWithCertificate = rawJson.filter(
          (student) =>
            student.DIPLOMA && // Asegurar que existe el campo DIPLOMA
            !student.DIPLOMA.toLowerCase().includes("no recibe diploma")
        );

        const formattedJson = studentsWithCertificate.map((row) => {
          const diplomaParts = row.DIPLOMA.split(" ");
          const range =
            diplomaParts.length > 1 ? diplomaParts.slice(1).join(" ") : "";
          const certificateData = certificate?.templates.find(
            (template) => template.range === range
          );
          const {
            certificate: certificateName,
            range: certificateRange,
            id,
          } = certificateData as Template;

          return {
            id: uuidv4(),
            certificate: {
              name: certificateName,
              range: certificateRange,
              id_certificate: certificate?.id || "",
              id_template: id,
              created_at: getCurrentDate(),
            },
            email: row.EMAIL,
            fullname: row.ESTUDIANTES,
            created_at: getCurrentDate(),
          };
        });

        setStudents(formattedJson);
      };
      reader.readAsBinaryString(file);
    }
  };

  const StudentList = () => {
    return (
      <section>
        {students.length > 0 ? (
          <article className="flex flex-col gap-4">
            <h3>Se crearan los certificados para los siguientes estudiantes</h3>
            <span className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
              {students.map((student) => (
                <span className="flex flex-col border-2 p-3 w-[300px] rounded-md">
                  <strong>
                    Nombre: <p className="font-normal">{student.fullname}</p>
                  </strong>
                  <strong>
                    Correo: <p className="font-normal">{student.email}</p>
                  </strong>

                  <span>
                    <strong>
                      Certificacion:{" "}
                      <p className="font-normal">
                        {student?.certificate?.name}
                      </p>
                    </strong>
                    <strong>
                      Diploma:{" "}
                      <p className="font-normal">
                        {student?.certificate?.range}
                      </p>
                    </strong>
                  </span>
                </span>
              ))}
            </span>
          </article>
        ) : (
          <p>Sin estudiantes para mostrar</p>
        )}
      </section>
    );
  };
  const handleUploadStudents = async (callback: () => void) => {
    if (!students || students.length === 0) {
      console.warn("No hay estudiantes para subir.");
      callback();
      return;
    }
    setIsLoading(true);
    try {
      // Subir todos los estudiantes de manera concurrente
      await Promise.all(
        students.map((student) =>
          handleCreateStudent(student).catch((error) => {
            console.error(
              `Error al subir estudiante con ID ${student.id}:`,
              error
            );
            // Manejo específico para un estudiante que falló
            return null; // Opcional: devolver algo para manejar el fallo
          })
        )
      );
      console.log("Todos los estudiantes se han subido exitosamente.");
    } catch (error) {
      console.error("Error inesperado al subir estudiantes:", error);
      throw error; // Relanzar el error si es necesario
    } finally {
      setIsLoading(false);
      // Llamar el callback independientemente del resultado
      callback();
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
              <article className="flex justify-between gap-5 items-center">
                <InputCertificates
                  value={certificate?.name}
                  onSelectionChange={setCertificate}
                  className="w-1/3"
                />
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) =>
                    setFile(e.target.files ? e?.target?.files[0] : null)
                  }
                  //className="w-2/3"
                />
                <Button color="secondary" onClick={handleConvert}>Convertir</Button>
              </article>

              <StudentList />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancelar
              </Button>
              <Button
                color="primary"
                isDisabled={isLoading}
                isLoading={isLoading}
                onPress={() => handleUploadStudents(onClose)}
              >
                Aceptar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
