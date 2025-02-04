import { useState } from "react";
import { AsideLayout } from "../../../../../layout/aside-layout";
import { InputCertificates } from "../../../certificates/components/input-certificate/input-certificate";
import { InputTypeTemplate } from "../../../certificates/components/input-type-template/input-type-template";
import { Button } from "@nextui-org/button";
import CertificateWritter from "../../../../../components/certificate-writter/certificate-writter";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import { CertificateStudent, Student } from "../../../../../interface/student";
import { getCurrentDate } from "../../../../../utils/date";
import { Input } from "@nextui-org/input";
import { v4 as uuidv4 } from "uuid";
import { handleCreateStudent } from "../../../../../services/students";
import { toast } from "sonner";
import { generateUniqueCode } from "../../../../../utils/code";
import { Timestamp } from "firebase/firestore";

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

const CreateStudent: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    id: uuidv4(),
    email: "",
    certificates: [],
    fullname: "",
    code: generateUniqueCode(),
    created_at: getCurrentDate(),
  });

  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [selectedTypeTemplate, setSelectedTypeTemplate] =
    useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateStudentCertificate = async () => {
    setIsLoading(true);
    try {
      const certificate: CertificateStudent = {
        name: selectedCertificate?.name || "",
        range: selectedTypeTemplate?.range || "",
        id_certificate: selectedCertificate?.id || "",
        id_template: selectedTypeTemplate?.id || "",
        created_at: getCurrentDate(),
      };

      const newStudent = { ...student, certificate };

      console.warn("ESTO VOY A GUARDAR EN FIREBASE: ", newStudent);
      await handleCreateStudent(newStudent as CreateStudent);
      toast.success("Estudiante registrado con éxito");

      setStudent({
        id: uuidv4(),
        email: "",
        certificates: [],
        fullname: "",
        code: generateUniqueCode(),
        created_at: getCurrentDate(),
      });

      setSelectedCertificate(null);
      setSelectedTypeTemplate(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al registrar al estudiante: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <AsideLayout>
        <div className="flex flex-col gap-5">
          <Input
            label="Nombres completos del estudiante"
            placeholder="Nombre completos del estudiante"
            value={student.fullname}
            name="fullname"
            onChange={(e) =>
              setStudent((prev) => ({
                ...prev,
                fullname: e.target.value.toUpperCase(),
              }))
            }
          />
          <Input
            placeholder="Correo del estudiante"
            label="Correo del estudiante"
            value={student.email}
            name="email"
            onChange={(e) =>
              setStudent((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />
          <InputCertificates
            filterByActive={true}
            value={selectedCertificate?.name || ""}
            onSelectionChange={setSelectedCertificate}
          />

          <InputTypeTemplate
            templates={selectedCertificate?.templates || []}
            selectedTemplate={selectedTypeTemplate}
            onSelectionChange={setSelectedTypeTemplate}
          />
          <Button
            isLoading={isLoading}
            isDisabled={
              isLoading ||
              !student.email ||
              !student.fullname ||
              !selectedCertificate ||
              !selectedTypeTemplate
            }
            color="primary"
            onPress={handleCreateStudentCertificate}
          >
            Crear estudiante
          </Button>
        </div>
        <CertificateWritter
          url={selectedTypeTemplate?.url || ""}
          fullname={student.fullname}
        />
      </AsideLayout>
    </div>
  );
};

export default CreateStudent;
