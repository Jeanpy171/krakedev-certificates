import { useState } from "react";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import { getCurrentDate } from "../../../../../utils/date";
import { AsideLayout } from "../../../../../layout/aside-layout";
import { InputCertificates } from "../../../certificates/components/input-certificate/input-certificate";
import { InputTypeTemplate } from "../../../certificates/components/input-type-template/input-type-template";
import { Button } from "@nextui-org/button";
import CertificateWritter from "../../../../../components/certificate-writter/certificate-writter";
import { Student } from "../../../../../interface/student";
import { handleUpdateStudent } from "../../../../../services/students";
import { toast } from "sonner";

const CreateStudentCertificate = ({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [selectedTypeTemplate, setSelectedTypeTemplate] =
    useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyExistingCertificate = () => {
    if (student?.certificates?.length === 0) return false;
    const existingCertificateIndex = handleFindIndexCertificate(
      selectedCertificate?.id ?? ""
    );
    if (existingCertificateIndex !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const handleFindIndexCertificate = (
    id_certificate: string
  ): number | null => {
    const index = student?.certificates?.findIndex(
      (certificate) => certificate.id_certificate === id_certificate
    );
    return index !== undefined && index !== -1 ? index : -1;
  };

  const handleCreateStudentCertificate = async () => {
    setIsLoading(true);
    try {
      const certificateData = {
        name: selectedCertificate?.name ?? "",
        range: selectedTypeTemplate?.range ?? "",
        id_certificate: selectedCertificate?.id ?? "",
        id_template: selectedTypeTemplate?.id ?? "",
        created_at: getCurrentDate(),
      };
      const updateCertificates = student?.certificates || [];

      if (student?.certificates && student?.certificates?.length > 0) {
        const existingCertificateIndex = handleFindIndexCertificate(
          selectedCertificate?.id ?? ""
        );
        if (existingCertificateIndex !== -1) {
          updateCertificates[existingCertificateIndex as number] =
            certificateData;
        } else {
          updateCertificates.push(certificateData);
        }
      } else {
        updateCertificates.push(certificateData);
      }

      console.warn("ESTO VOY A GUARDAR EN FIREBASE: ", updateCertificates);
      await handleUpdateStudent(student.id, {
        certificates: updateCertificates,
      });
      toast.success("Certificado del estudiante creado correctamente");
      onClose();
    } catch (error) {
      console.log(error);
      toast.success("Error al crear el certificado del estudiante");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyExistingCertificate = handleVerifyExistingCertificate();

  return (
    <article className="h-[500px]">
      <AsideLayout>
        <div className="flex flex-col gap-5">
          <InputCertificates
            filterByActive={true}
            value={selectedCertificate?.name}
            onSelectionChange={setSelectedCertificate}
          />

          <InputTypeTemplate
            templates={selectedCertificate?.templates || []}
            selectedTemplate={selectedTypeTemplate}
            onSelectionChange={setSelectedTypeTemplate}
          />
          {verifyExistingCertificate && (
            <strong>
              Certificado de tipo {selectedCertificate?.name} ya creado, se
              sobreescribira el actual
            </strong>
          )}
          <Button
            isLoading={isLoading}
            isDisabled={
              isLoading || !selectedCertificate || !selectedTypeTemplate
            }
            color="primary"
            onPress={handleCreateStudentCertificate}
          >
            Crear certificado
          </Button>
        </div>
        <CertificateWritter
          url={selectedTypeTemplate?.url ?? ""}
          fullname={student?.fullname ?? ""}
        />
      </AsideLayout>
    </article>
  );
};

export default CreateStudentCertificate;
