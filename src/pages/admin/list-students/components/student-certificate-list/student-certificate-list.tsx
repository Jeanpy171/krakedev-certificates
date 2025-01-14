import { IoMdClose } from "react-icons/io";
import { Student } from "../../../../../interface/student";
import useCertificateStore from "../../../../../store/certificates";
import { Input } from "@nextui-org/input";
import CertificateWritter from "../../../../../components/certificate-writter";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { handleUpdateStudent } from "../../../../../services/students";
import { getCurrentDate } from "../../../../../utils/date";
import { toast } from "sonner";

const StudentCertificateList = ({
  student,
  onClose,
}: {
  student: Student;
  onClose: () => void;
}) => {
  const { certificates } = useCertificateStore();
  const [studentData, setStudentData] = useState(student);
  const [isLoading, setIsLoading] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState<string | null>(null);

  const handleGetTemplateUrl = (
    id_certificate: string,
    id_template: string
  ) => {
    if (certificates.length === 0) return null;
    let urlTemplate = "";
    const certificate = certificates.find(
      (certificates) => certificates.id === id_certificate
    );
    if (certificate) {
      const template = certificate.templates.find(
        (template) => template.id === id_template
      );
      if (template && template.url) {
        urlTemplate = template.url;
      }
    }
    return urlTemplate;
  };

  const handleCreateStudentCertificate = async () => {
    setIsLoading(true);
    try {
      console.warn(
        "ESTO VOY A GUARDAR EN FIREBASE: ",
        studentData.certificates
      );
      let updateStudentCertificates: Partial<Student> = {
        certificates: studentData.certificates,
      };
      if (studentData.observation && statusUpdate) {
        updateStudentCertificates = {
          status: studentData.status,
          fullname: studentData.fullname,
          updated_at: getCurrentDate(),
          ...updateStudentCertificates,
        };
      }
      await handleUpdateStudent(studentData.id, updateStudentCertificates);
      toast.success("Certificados del estudiante actualizados correctamente");
      onClose();
    } catch (error) {
      console.log(error);
      toast.success("Error al actualizar los certificados del estudiante");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="flex flex-col gap-4 h-[600px]">
      {student?.observation && student.status === "pending" && (
        <article className="flex flex-col gap-3">
          <p className="font-semibold">
            Se ha solicitado una modificacion para los nombres completos del
            estudiante
          </p>
          <span className="flex gap-3">
            <Input
              label="Observacion del estudiante"
              placeholder="Observacion del estudiante"
              value={student?.observation}
              isDisabled={true}
              name="observation"
            />
            <span className="flex gap-4 w-2/3 justify-center items-center">
              <Button
                color="success"
                onPress={() => {
                  setStudentData({
                    ...studentData,
                    fullname: studentData?.observation ?? studentData.fullname,
                    status: "approved",
                  });
                  setStatusUpdate("approved");
                }}
              >
                Confirmar
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  setStudentData({
                    ...studentData,
                    status: "reject",
                  });
                  setStatusUpdate("reject");
                }}
              >
                Descartar
              </Button>
            </span>
          </span>
        </article>
      )}
      <ul className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] w-full h-[480px] overflow-y-auto overflow-x-hidden">
        {studentData?.certificates && studentData?.certificates.length > 0 ? (
          studentData.certificates.map((certificate) => (
            <li
              key={certificate.id_certificate}
              className="relative flex flex-col gap-3 p-4 py-8 border rounded-md shadow-md w-full max-w-[350px] h-[350px] overflow-hidden"
            >
              <button
                onClick={() => {
                  if (!studentData.certificates?.length) return;
                  const updatedCertificates = studentData.certificates.filter(
                    (studentCertificate) =>
                      studentCertificate.id_certificate !==
                      certificate.id_certificate
                  );
                  console.warn("ESTO PASA SI ELIMINO: ", updatedCertificates);
                  setStudentData({
                    ...studentData,
                    certificates: updatedCertificates || [],
                  });
                }}
                className="absolute top-2 right-2 z-50 rounded-sm bg-red-500"
              >
                <IoMdClose size={20} color="white" />
              </button>
              <div className="truncate">
                <Input value={certificate.name} isDisabled={true} />
              </div>
              <div className="flex-1 overflow-hidden">
                <CertificateWritter
                  url={handleGetTemplateUrl(
                    certificate.id_certificate,
                    certificate.id_template
                  )}
                  fullname={studentData.fullname}
                />
              </div>
            </li>
          ))
        ) : (
          <span className="flex w-full h-[200px] justify-center items-center">
            <p>No tiene certificados</p>
          </span>
        )}
      </ul>

      <span className="flex justify-start items-center">
        <Button
          size="md"
          isLoading={isLoading}
          isDisabled={isLoading}
          color="success"
          onPress={handleCreateStudentCertificate}
        >
          Confirmar cambios
        </Button>
      </span>
    </article>
  );
};

export default StudentCertificateList;
