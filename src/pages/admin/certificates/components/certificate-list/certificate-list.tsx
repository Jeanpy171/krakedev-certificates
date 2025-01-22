import { useEffect, useState } from "react";
import { Input } from "@nextui-org/input";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@nextui-org/button";
import { Certificate } from "../../../../../interface/certificate";
import { Template } from "../../../../../interface/template";
import TemplateList from "../template-list/template-list";
import { InputCertificates } from "../input-certificate/input-certificate";
import {
  handleUpdateCertificate,
  handleUpdateStateCertificate,
} from "../../../../../services/certificates";
import useCertificateStore from "../../../../../store/certificates";
import { toast } from "sonner";

const CertificateList = () => {
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const { fetchCertificates, certificates, setCertificates } =
    useCertificateStore();

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

  const addTemplate = () => {
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

  const deleteTemplate = (id: string) => {
    setSelectedCertificate((prevCertificate) => {
      if (!prevCertificate) return prevCertificate;

      const updatedTemplates = prevCertificate.templates.filter(
        (template) => template.id !== id
      );

      return { ...prevCertificate, templates: updatedTemplates };
    });
  };

  const handleUpdate = async () => {
    if (
      !selectedCertificate?.name ||
      selectedCertificate.templates.length === 0 ||
      !selectedCertificate.id
    ) {
      toast.error(
        "Debe proporcionar el nombre y las plantillas de la certificacion que quieres actualizar"
      );
      return;
    }

    const validateTemplatesName = selectedCertificate.templates.some(
      (template) =>
        template.range === "" ||
        (!template.url && !template.file) ||
        (template.url && template.file === null)
    );

    if (validateTemplatesName) {
      toast.error("Debe proporcionar el tipo y el pdf de cada plantilla");
      return;
    }

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

  const handleChangeStateCertificate = async (state: boolean) => {
    if (!selectedCertificate?.id)
      throw new Error("Necesitas enviar el id de la certificacion");
    setIsLoadingDelete(true);
    try {
      await handleUpdateStateCertificate(selectedCertificate?.id, state);
      const updateCertificates = [...certificates];
      const filterById = updateCertificates.findIndex(
        (certificate) => certificate.id === selectedCertificate?.id
      );
      updateCertificates[filterById] = {
        ...updateCertificates[filterById],
        is_active: false,
      };
      setCertificates(updateCertificates);
      toast.success("Certificacion eliminada correctamente");
      setSelectedCertificate(null);
    } catch (error) {
      console.log(error);
      toast.success("Error al eliminar la certificacion");
      throw error;
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <article className="flex gap-4 justify-between items-center">
        <InputCertificates
          filterByActive={false}
          value={selectedCertificate?.name}
          onSelectionChange={setSelectedCertificate}
          className="w-1/2"
        />
        {selectedCertificate ? (
          selectedCertificate?.is_active ? (
            <Button
              isLoading={isLoadingDelete}
              isDisabled={isLoadingDelete}
              onPress={() => handleChangeStateCertificate(false)}
              color="danger"
            >
              Desactivar certificacion
            </Button>
          ) : (
            <Button
              isLoading={isLoadingDelete}
              isDisabled={isLoadingDelete}
              onPress={() => handleChangeStateCertificate(true)}
              color="success"
            >
              Activar certificacion
            </Button>
          )
        ) : null}
      </article>
      {selectedCertificate && !selectedCertificate?.is_active && (
        <p className="text-red-400 font-semibold">
          Esta certificacion fue eliminada, para poder asignarla a un
          estudiante, debes actualizarla
        </p>
      )}
      <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] place-items-center">
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
                Confirmar cambios
              </Button>
              <Button
                onClick={() => setSelectedCertificate(null)}
                color="danger"
              >
                Descartar cambios
              </Button>
            </div>
            <TemplateList
              isEditable={true}
              templates={selectedCertificate?.templates}
              handleOnChange={handleOnChange}
              addTemplate={addTemplate}
              deleteTemplate={deleteTemplate}
            />
          </span>
        ) : (
          <p>
            Selecciona una certificacion para visualizar las plantillas adjuntas
          </p>
        )}
      </article>
    </section>
  );
};

export default CertificateList;
