import { useState } from "react";
import { InputTemplates } from "../input-template/input-templates";
import { Template } from "../../../../../interface/template";
import { Input } from "@nextui-org/input";
import { Certificate } from "../../../../../interface/certificate";
import CertificateList from "../certificate-list/certificate-list";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/button";
import { handleUpdateTemplate } from "../../../../../services/templates";

const TemplateList = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );

  const handleOnChange = (field: string, value: string | Certificate) => {
    if (!field || value === undefined || value === null) return;

    setSelectedTemplate((prevTemplate) => {
      if (!prevTemplate) {
        return prevTemplate;
      }

      if (field === "certificates" && typeof value === "object") {
        const existingCertificates = [...prevTemplate.certificates];
        const index = existingCertificates.findIndex(
          (certificate) => certificate.id === value.id
        );

        if (index !== -1) {
          existingCertificates[index] = value;
        } else {
          existingCertificates.push(value);
        }

        return { ...prevTemplate, certificates: existingCertificates };
      }

      return {
        ...prevTemplate,
        [field]: value as string,
      };
    });
  };

  const addCertificate = () => {
    const newCertificate: Certificate = {
      event: selectedTemplate?.name || "",
      id: uuidv4(),
      type: "",
      file: null,
      created_at: new Date().toISOString(),
    };

    handleOnChange("certificates", newCertificate);
  };

  const deleteCertificate = (id: string) => {
    setSelectedTemplate((prevTemplate) => {
      if (!prevTemplate) return prevTemplate;

      const updatedCertificates = prevTemplate.certificates.filter(
        (certificate) => certificate.id !== id
      );

      return { ...prevTemplate, certificates: updatedCertificates };
    });
  };

  const handleUpdate = async () => {
    if (!selectedTemplate?.id) return;
    
    console.warn("ESTA ES LA PLANTILLA QUE VOY A SUBIR: ", selectedTemplate);
    try {
      const response = await handleUpdateTemplate(
        selectedTemplate?.id,
        selectedTemplate?.certificates
      );
      console.warn(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <article className="flex flex-col gap-4 justify-start items-start w-1/2">
        <InputTemplates
          value={selectedTemplate?.name}
          onSelectionChange={setSelectedTemplate}
        />
      </article>
      <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {selectedTemplate?.certificates ? (
          <span className="flex flex-col gap-5">
            <div className="flex gap-5">
              <Input
                value={selectedTemplate?.name}
                onChange={(e) => handleOnChange("name", e.target.value)}
              />
              <Button onClick={handleUpdate} color="success">
                Confirmar
              </Button>
              <Button onClick={() => setSelectedTemplate(null)} color="danger">
                Cancelar
              </Button>
            </div>
            <CertificateList
              certificates={selectedTemplate.certificates}
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

export default TemplateList;
