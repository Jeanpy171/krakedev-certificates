import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { v4 as uuidv4 } from "uuid";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import TemplateList from "../template-list/template-list";
import { handleCreateCertificate } from "../../../../../services/certificates";
import { toast } from "sonner";
import useCertificateStore from "../../../../../store/certificates";

const CreateCertificate = () => {
  const [certificate, setCertificate] = useState<Certificate | null>({
    id: uuidv4(),
    name: "",
    created_at: new Date().toISOString(),
    templates: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchCertificates } = useCertificateStore();

  useEffect(() => {
    if (certificate?.name) {
      setCertificate((prevTemplate) => {
        if (!prevTemplate) return null;
        return {
          ...prevTemplate,
          templates: prevTemplate.templates.map((template) => ({
            ...template,
            certificate: prevTemplate.name,
          })),
        };
      });
    }
  }, [certificate?.name]);

  const handleOnChange = (field: string, value: string | Template) => {
    if (!field || value === undefined || value === null) return;

    setCertificate((prevCertificate) => {
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

  const addCertificate = () => {
    if (!certificate) return;

    const newTemplate: Template = {
      certificate: certificate.name,
      id: uuidv4(),
      range: "",
      file: null,
      created_at: new Date().toISOString(),
    };

    handleOnChange("templates", newTemplate);
  };

  const handleUploadTemplate = async () => {
    if (!certificate) return;

    setIsLoading(true);
    console.warn("ESTA ES LA PLANTILLA QUE VOY A SUBIR: ", certificate);

    try {
      await handleCreateCertificate(certificate);
      toast.success("Certificación creada con éxito");
      setCertificate({
        id: uuidv4(),
        name: "",
        created_at: new Date().toISOString(),
        templates: [],
      });
      fetchCertificates();
    } catch (error) {
      console.error(error);
      toast.error("Error al crear nueva certificación");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCertificate = (id: string) => {
    setCertificate((prevCertificate) => {
      if (!prevCertificate) return prevCertificate;

      const updatedTemplates = prevCertificate.templates.filter(
        (template) => template.id !== id
      );

      return { ...prevCertificate, templates: updatedTemplates };
    });
  };

  return (
    <div className="flex flex-col gap-4 justify-start items-start p-10 w-full">
      <article className="flex gap-5 w-full">
        <Input
          label="Nombre del certificado"
          placeholder="Nombre del certificado"
          onChange={(e) => handleOnChange("name", e.target.value)}
        />
        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          color="success"
          onClick={handleUploadTemplate}
        >
          Confirmar
        </Button>
      </article>

      <section className="flex flex-wrap gap-3 p-3 w-full h-full">
        <TemplateList
          isEditable={true}
          templates={certificate?.templates || []}
          handleOnChange={handleOnChange}
          addCertificate={addCertificate}
          deleteCertificate={deleteCertificate}
        />
      </section>
    </div>
  );
};

export default CreateCertificate;
