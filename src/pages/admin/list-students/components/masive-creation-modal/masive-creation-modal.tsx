/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import { InputCertificates } from "../../../certificates/components/input-certificate/input-certificate";
import { handleCreateStudent } from "../../../../../services/students";
import { getCurrentDate } from "../../../../../utils/date";
import { Certificate } from "../../../../../interface/certificate";
import { toast } from "sonner";
import { generateUniqueCode } from "../../../../../utils/code";
import { Student } from "../../../../../interface/student";

interface ExcelRow {
  DIPLOMA?: string;
  DIPLOMAS?: string;
  EMAIL: string;
  ESTUDIANTES?: string;
  ESTUDIANTE?: string;
}

export interface CreateStudent extends Partial<Student> {
  id: string;
  email: string;
  fullname: string;
  created_at: Timestamp;
  code: string;
  certificate?: {
    name: string;
    range: string;
    id_certificate: string;
    id_template: string;
    created_at: Timestamp;
  };
}

const parseExcelFile = (
  file: File,
  certificate: Certificate | null
): Promise<CreateStudent[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (!e.target) return reject("Error al leer el archivo.");

      const data = e.target.result as string;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawJson: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet);
      const students: CreateStudent[] = [];

      rawJson
        .filter((row) => {
          const diploma = row.DIPLOMA || row.DIPLOMAS;
          return (
            diploma && !diploma.toLowerCase().includes("no recibe diploma")
          );
        })
        .forEach((row) => {
          const fullname = row.ESTUDIANTES || row.ESTUDIANTE;
          if (!fullname) {
            toast.error(
              "No se encontraron los nombres de los estudiantes, revise la columna en el excel"
            );
            return;
          }

          const diploma = row.DIPLOMA || row.DIPLOMAS;

          if (!diploma) {
            toast.error(
              "No se encontro diploma para el estudiante, revise la columna en el excel"
            );
            return;
          }

          const diplomaParts = diploma.split(" ");
          const range =
            diplomaParts[0].toLowerCase() === "diploma"
              ? diplomaParts.slice(1).join(" ")
              : diplomaParts.join(" ");

          const certificateData = certificate?.templates.find(
            (template) => template.range.toLowerCase() === range.toLowerCase()
          );

          if (!certificateData) {
            toast.error(
              `No se encontró un certificado para el rango: ${range}`
            );
            return;
          }

          if (!row.EMAIL) {
            toast.error(
              "No se encontraron los emails de los estudiantes, revise la columna en el excel"
            );
            return;
          }

          students.push({
            id: uuidv4(),
            email: row.EMAIL,
            fullname,
            code: generateUniqueCode(),
            created_at: getCurrentDate(),
            certificate: {
              name: certificateData.certificate,
              range: certificateData.range,
              id_certificate: certificate?.id || "",
              id_template: certificateData.id,
              created_at: getCurrentDate(),
            },
          });
        });

      if (students.length === 0) {
        toast.error("No se detectaron estudiantes con certificados");
        return;
      }
      resolve(students);
    };

    reader.onerror = () => {
      toast.error("El archivo no tiene el formato requerido");
      reject("Error al leer el archivo.");
    };

    reader.readAsBinaryString(file);
  });
};

const uploadStudents = async (
  students: CreateStudent[],
  callback: () => void,
  callbackUpdate: () => void
): Promise<void> => {
  if (!students.length) {
    callback();
    return;
  }

  try {
    await Promise.all(
      students.map((student) =>
        handleCreateStudent(student).catch(() => {
          return null;
        })
      )
    );
    toast.success("Todos los estudiantes se han subido exitosamente.");
    callbackUpdate();
  } catch (error) {
    toast.error("Error inesperado al subir estudiantes.");
  } finally {
    callback();
  }
};

interface CustomModal extends Omit<ModalProps, "children"> {
  handleUpdateMasiveStudents: () => void;
}
export default function MasiveCreationModal({
  handleUpdateMasiveStudents,
  ...props
}: CustomModal) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [students, setStudents] = useState<CreateStudent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileConversion = async () => {
    if (!file) return;
    try {
      const parsedStudents = await parseExcelFile(file, certificate);
      setStudents(parsedStudents);
    } catch (error) {
      toast.error("Ocurrió un error al procesar el archivo.");
    }
  };

  const StudentList = () => (
    <section>
      {students.length > 0 ? (
        <article className="flex flex-col gap-4">
          <span className="flex justify-between items-center">
            <h3>Se crearán los certificados para los siguientes estudiantes</h3>
            <h4 className="flex gap-2">
              <h5>Total</h5>:<strong>{students.length}</strong>
            </h4>
          </span>

          <div className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
            {students.map((student) => (
              <div
                key={student.id}
                className="flex flex-col border-2 p-3 w-[300px] rounded-md"
              >
                <strong>
                  Nombre: <p className="font-normal">{student.fullname}</p>
                </strong>
                <strong>
                  Correo: <p className="font-normal">{student.email}</p>
                </strong>
                <div>
                  <strong>
                    Certificación:{" "}
                    <p className="font-normal">{student?.certificate?.name}</p>
                  </strong>
                  <strong>
                    Diploma:{" "}
                    <p className="font-normal">{student?.certificate?.range}</p>
                  </strong>
                </div>
              </div>
            ))}
          </div>
        </article>
      ) : (
        <article className="my-5 ">
          <p className="flex justify-center items-center'">
            Sin estudiantes para mostrar o no se detectaron estudiantes con
            certificados
          </p>
        </article>
      )}
    </section>
  );

  return (
    <Modal
      {...props}
      onClose={() => {
        setStudents([]);
        setFile(null);
        setCertificate(null);
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Creación Masiva de Certificados
            </ModalHeader>
            <ModalBody>
              <div className="flex justify-between gap-5 items-center">
                <InputCertificates
                  filterByActive={true}
                  value={certificate?.name}
                  onSelectionChange={setCertificate}
                  className="w-1/3"
                />
                {certificate?.name && (
                  <>
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                      <>
                        <Button color="warning" onClick={handleFileConversion}>
                          Convertir
                        </Button>
                        <Button color="danger" onClick={() => setStudents([])}>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
              <StudentList />
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  setStudents([]);
                  onClose();
                }}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                isDisabled={isLoading}
                isLoading={isLoading}
                onPress={() => {
                  setIsLoading(true);
                  uploadStudents(
                    students,
                    onClose,
                    handleUpdateMasiveStudents
                  ).finally(() => setIsLoading(false));
                }}
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
