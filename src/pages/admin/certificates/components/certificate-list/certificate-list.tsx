import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/button";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import TemplateList from "../template-list/template-list";
import { InputCertificates } from "../input-certificate/input-certificate";
import { handleUpdateCertificate } from "../../../../../services/certificates";
import useCertificateStore from "../../../../../store/certificates";
import { toast } from "sonner";

const CertificateList = () => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchCertificates } = useCertificateStore();

  const handleOnChange = (field: string, value: string | Template) => {
    if (
      !field ||
      value === undefined ||
      value === null ||
      selectedCertificate === null
    )
      return;

    setSelectedCertificate((prevCertificate) => {
      if (!prevCertificate) return null;

      if (field === "templates" && typeof value === "object") {
        const existingTemplates = [...prevCertificate.templates];
        const index = existingTemplates.findIndex(
          (template) => template.id === value.id
        );

        if (index !== -1) {
          existingTemplates[index] = value;
        } else {
          existingTemplates.push(value);
        }

        return { ...prevCertificate, templates: existingTemplates };
      } else {
        return { ...prevCertificate, [field]: value as string };
      }
    });
  };

  useEffect(() => {
    console.warn(selectedCertificate);
  }, [selectedCertificate]);

  // Agrega una nueva plantilla
  const addCertificate = () => {
    if (!selectedCertificate) return;

    const newTemplate: Template = {
      certificate: selectedCertificate.name,
      id: uuidv4(),
      range: "",
      file: null,
      created_at: new Date().toISOString(),
    };

    handleOnChange("templates", newTemplate);
  };

  // Elimina una plantilla específica por ID
  const deleteCertificate = (id: string) => {
    setSelectedCertificate((prevCertificate) => {
      if (!prevCertificate) return prevCertificate;

      const updatedTemplates = prevCertificate.templates.filter(
        (template) => template.id !== id
      );

      return { ...prevCertificate, templates: updatedTemplates };
    });
  };

  const handleUpdate = async () => {
    if (!selectedCertificate?.id) return;
    setIsLoading(true);
    console.warn("ESTA ES LA PLANTILLA QUE VOY A SUBIR: ", selectedCertificate);
    try {
      await handleUpdateCertificate(selectedCertificate?.id, {
        name: selectedCertificate.name,
        templates: selectedCertificate?.templates,
      });
      toast.success("Certificación actualizada con éxito");
      fetchCertificates();
      setSelectedCertificate(null);
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar la certificación");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <article className="flex flex-col gap-4 justify-start items-start w-1/2">
        <InputCertificates
          value={selectedCertificate?.name}
          onSelectionChange={setSelectedCertificate}
        />
      </article>
      <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {selectedCertificate?.templates ? (
          <span className="flex flex-col gap-5">
            <h5 className="font-semibold">
              Certificacion y plantillas seleccionadas
            </h5>
            <div className="flex gap-5">
              <Input
                value={selectedCertificate?.name}
                onChange={(e) => handleOnChange("name", e.target.value)}
              />
              <Button
                isLoading={isLoading}
                isDisabled={isLoading}
                onClick={handleUpdate}
                color="success"
              >
                Confirmar
              </Button>
              <Button
                onClick={() => setSelectedCertificate(null)}
                color="danger"
              >
                Cancelar
              </Button>
            </div>
            <TemplateList
              isEditable={true}
              templates={selectedCertificate?.templates}
              handleOnChange={handleOnChange}
              addCertificate={addCertificate}
              deleteCertificate={deleteCertificate}
            />
          </span>
        ) : (
          <p>
            Selecciona una plantilla para visualizar el tipo de certificaciones
          </p>
        )}
      </article>
    </section>
  );
};

export default CertificateList;
