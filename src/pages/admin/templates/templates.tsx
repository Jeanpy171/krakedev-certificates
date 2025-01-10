import React, { useEffect, useState } from "react";
import { AsideLayout } from "../../../layout/aside-layout";
import { Template } from "../../../interface/template";
import { InputTemplates } from "./components/input-template/input-templates";
import { Input } from "@nextui-org/input";

export const Templates = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  //   const [selectedTypeTemplate, setSelectedTypeTemplate] =
  //     useState<Certificate | null>(null);

  useEffect(() => {
    console.warn(selectedTemplate);
    //console.warn(selectedTypeTemplate);
  }, [selectedTemplate]);

  return (
    <main className="h-full flex flex-col p-5 justify-center items-center gap-3">
      <h3 className="text-3xl font-bold">
        Administracion de Certificados KRAKEDEV
      </h3>
      <AsideLayout>
        <div className="flex flex-col gap-4 justify-start items-start p-10 w-full">
          <InputTemplates
            value={selectedTemplate?.name}
            onSelectionChange={setSelectedTemplate}
          />

          {/* <InputTypeTemplate
            certificates={selectedTemplate?.certificates || []}
            selectedCertificate={selectedTypeTemplate}
            onSelectionChange={setSelectedTypeTemplate}
          /> */}
          {/* <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <Input
              label="Email"
              name="email"
              required
              placeholder="Digita tu correo electrónico"
              type="email"
            />
            <Input
              label="Password"
              name="password"
              required
              placeholder="Digita tu contrasenia"
              type="password"
            />
            <Button isLoading={isLoading} type="submit">
              Buscar
            </Button>
          </form> */}
        </div>
        <article className="overflow-y-auto w-full gap-3 grid grid-cols-2">
          {selectedTemplate?.certificates.map((certificate) => (
            <span className="flex flex-col gap-4">
              <Input
              label="Tipo de certificado"
              name="type"
              value={certificate.name}
              required
              placeholder="Digita tu correo electrónico"
              type="email"
            />
              <img src={certificate.url} />
            </span>
          ))}
        </article>
        {/* <CertificateVisualizer url={selectedTypeTemplate?.url} /> */}
      </AsideLayout>
    </main>
  );
};
