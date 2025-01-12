import { useEffect, useState } from "react";
import { Template } from "../../../../../interface/template";
import { Certificate } from "../../../../../interface/certificate";
import { handleCreateTemplate } from "../../../../../services/templates";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { v4 as uuidv4 } from "uuid";
import CertificateList from "../certificate-list/certificate-list";

const CreateTemplate = () => {
  const [template, setTemplate] = useState<Template>({
    id: uuidv4(),
    name: "",
    created_at: new Date().toISOString(),
    certificates: [],
  });

  useEffect(() => {
    console.warn("PLANTILLA NUEVA: ", template);
  }, [template]);

  useEffect(() => {
    setTemplate((prevTemplate) => ({
      ...prevTemplate,
      certificates: prevTemplate.certificates.map((certificate) => ({
        ...certificate,
        event: prevTemplate.name,
      })),
    }));
  }, [template.name]);

  const handleOnChange = (field: string, value: string | Certificate) => {
    if (!field || value === undefined || value === null) return;

    if (field === "certificates" && typeof value === "object") {
      setTemplate((prevTemplate) => {
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
      });
    } else {
      setTemplate((prevTemplate) => ({
        ...prevTemplate,
        [field]: value as string,
      }));
    }
  };

  const addCertificate = () => {
    const newCertificate: Certificate = {
      event: template.name,
      id: uuidv4(),
      type: "",
      file: null,
      created_at: new Date().toISOString(),
    };

    handleOnChange("certificates", newCertificate);
  };

  const handleUploadTemplate = async () => {
    console.warn("ESTA ES LA PLANTILLA QUE VOY A SUBIR: ", template);
    try {
      const response = await handleCreateTemplate(template);
      console.warn(response);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteCertificate = (id: string) => {
    setTemplate((prevTemplate) => {
      if (!prevTemplate) return prevTemplate;

      const updatedCertificates = prevTemplate.certificates.filter(
        (certificate) => certificate.id !== id
      );

      return { ...prevTemplate, certificates: updatedCertificates };
    });
  };

  return (
    <div className="flex flex-col gap-4 justify-start items-start p-10 w-full">
      <article className="flex gap-5 w-full">
        <Input
          placeholder="Nombre de la plantilla"
          onChange={(e) => handleOnChange("name", e.target.value)}
        />
        <Button onClick={handleUploadTemplate}>Confirmar</Button>
      </article>

      <section className="flex flex-wrap gap-3 p-3 w-full h-full">
        <CertificateList
          certificates={template.certificates}
          handleOnChange={handleOnChange}
          addCertificate={addCertificate}
          deleteCertificate={deleteCertificate}
        />
      </section>
    </div>
  );
};

export default CreateTemplate;
