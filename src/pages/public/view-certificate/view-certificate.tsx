import { useEffect, useState, useCallback, FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { saveAs } from "file-saver";
import { handleGetCertificateById } from "../../../services/certificates";
import { CertificateStudent, Student } from "../../../interface/student";
import { handleUpdateStudent } from "../../../services/students";
import { getCurrentDate } from "../../../utils/date";
import { Routes } from "../../../navigation/routes";
import CertificateWritter from "../../../components/certificate-writter";

const ViewCertificate = () => {
  const { state } = useLocation();
  const data: Student = state;
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>({
    ...data,
    certificates: data.certificates || [],
  });
  const [updateFullname, setUpdateFullname] = useState<string>(
    student.fullname
  );

  const [selectedCertificate, setSelectedCertificate] =
    useState<CertificateStudent | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [certificatesLoaded, setCertificatesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const loadCertificateUrls = useCallback(async () => {
    if (certificatesLoaded || !student.certificates?.length) return;

    try {
      const updatedCertificates = await Promise.all(
        student.certificates.map(async (certificate) => {
          try {
            const certificateData = await handleGetCertificateById(
              certificate.id_certificate
            );
            console.warn("CERTIFICADOS COMPLETOS: ", certificateData);

            if (!certificateData) {
              return { ...certificate, url: "" };
            }

            const matchingTemplate = certificateData.templates.find(
              (template) => template.id === certificate.id_template
            );
            console.warn("PLANTILLA DE CERTIFICADO: ", matchingTemplate);

            return {
              ...certificate,
              name: matchingTemplate?.certificate ?? certificate.name,
              url: matchingTemplate?.url ?? "",
            };
          } catch (error) {
            console.error("Error al procesar un certificado:", error);
            return { ...certificate, url: "" };
          }
        })
      );

      setStudent((prev) => ({
        ...prev,
        certificates: updatedCertificates,
      }));

      setCertificatesLoaded(true);
    } catch (error) {
      console.error("Error general al cargar URLs de certificados:", error);
    }
  }, [certificatesLoaded, student]);

  useEffect(() => {
    loadCertificateUrls();
  }, [loadCertificateUrls, data]);

  const handleCertificateSelection = (key: unknown) => {
    const certificate = student?.certificates?.find(
      (cert) => cert.id_certificate === key
    );
    setSelectedCertificate(certificate || null);
  };

  const handleDownloadPdf = () => {
    if (!pdfUrl) {
      alert("Por favor, genera una previsualización antes de descargar.");
      return;
    }
    saveAs(pdfUrl, `${selectedCertificate?.name + student.fullname}.pdf`);
  };

  const handleUpdateStudentName = async (e: FormEvent) => {
    e.preventDefault();
    if (updateFullname === student.fullname) return;
    setIsLoading(true);
    try {
      await handleUpdateStudent(student.id, {
        observation: updateFullname,
        status: "pending",
        updated_at: getCurrentDate(),
      });
      alert("Nombre actualizado correctamente");
      navigate(Routes.public.path + Routes.public.routes.search.path, {
        replace: true,
      });
    } catch (error) {
      console.warn("Error al actualizar datos del estudiante: ", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.warn("ESTUDIANTE: ", student);
  }, [student]);

  return (
    <main className="h-full flex flex-col gap-5 justify-start items-center p-5">
      <h3 className="text-3xl font-bold">{`Bienvenido ${student.fullname}`}</h3>

      <article className="flex w-full flex-1">
        <section className="w-2/6 flex flex-col gap-4 justify-between items-start p-10">
          <article className="flex flex-col gap-4 w-full">
            {!student.observation ? (
              <>
                <h4>
                  ¿Encuentras fallos en el nombre? Edita la información aquí
                </h4>
                <strong className="text-xs">
                  Solo puedes modificarlo por una ocasion
                </strong>
                <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={handleUpdateStudentName}
                >
                  <Input
                    value={updateFullname ?? ""}
                    name="fullname"
                    onChange={(e) =>
                      setUpdateFullname(e?.target?.value.toUpperCase())
                    }
                  />
                  <Button
                    color="success"
                    type="submit"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    Actualizar
                  </Button>
                </form>
              </>
            ) : student.status === "pending" ? (
              <h4>Estamos revisando la actualización solicitada </h4>
            ) : null}

            {student.certificates?.length ? (
              <Autocomplete
                label="Selecciona el certificado"
                value={selectedCertificate?.name}
                selectedKey={selectedCertificate?.id_certificate}
                onSelectionChange={handleCertificateSelection}
              >
                {student.certificates.map((certificate) => (
                  <AutocompleteItem key={certificate.id_certificate}>
                    {certificate.name}
                  </AutocompleteItem>
                ))}
              </Autocomplete>
            ) : (
              <p>No hay certificados registrados para ti</p>
            )}

            {selectedCertificate && (
              <Button onPress={handleDownloadPdf} color="success">
                Descargar PDF
              </Button>
            )}
          </article>

          <Button
            onPress={() =>
              navigate(Routes.public.path + Routes.public.routes.search.path, {
                replace: true,
              })
            }
            color="danger"
          >
            Salir
          </Button>
        </section>

        <section className="w-4/6 flex justify-center items-center">
          <CertificateWritter
            url={selectedCertificate?.url ?? ""}
            fullname={student.fullname}
            onSetPdf={setPdfUrl}
          />
        </section>
      </article>
    </main>
  );
};

export default ViewCertificate;
