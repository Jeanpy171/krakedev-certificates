import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalProps,
} from "@nextui-org/modal";
import { Student } from "../../../../../interface/student";
import { Input } from "@nextui-org/input";
import { Tabs, Tab } from "@nextui-org/tabs";
import { AsideLayout } from "../../../../../layout/aside-layout";
import { InputTemplates } from "../../../templates/components/input-template/input-templates";
import { InputTypeTemplate } from "../../../templates/components/input-type-template/input-type-template";
import { Template } from "../../../../../interface/template";
import { useState } from "react";
import { Certificate } from "../../../../../interface/certificate";
import { CertificateVisualizer } from "../../../../../components/certificate-visualizer/certificate-visualizer";

interface CustomModal extends Omit<ModalProps, "children"> {
  data: Student | null;
}

export default function StudentModal({ data, ...props }: CustomModal) {
  // const handleRenderAction = () => {
  //   switch (data?.action) {
  //     case Action.view: {
  //       return <p>MIRANDO EL CONTENIDO DE {data.data.fullname}</p>;
  //     }
  //     case Action.edit: {
  //       return <p>EDITANDO EL CONTENIDO DE {data.data.fullname}</p>;
  //     }
  //     case Action.delete: {
  //       return <p>ELIMINANDO EL CONTENIDO DE {data.data.fullname}</p>;
  //     }
  //   }
  // };
  const CertificateList = () => {
    if (data?.certificates?.length === 0)
      return <p>NO HAY CERTIFICADOS DISPONIBLES</p>;

    return (
      <article className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
        {data?.certificates ? (
          data.certificates.map((certificate) => (
            <span
              key={certificate.id}
              className="flex flex-col gap-3 p-2 border rounded-md shadow-md "
            >
              <Input value={certificate.event} />
              <img
                src={certificate.url}
                className="w-auto h-auto object-cover"
              />
            </span>
          ))
        ) : (
          <p>No tiene certificados</p>
        )}
      </article>
    );
  };

  const CreateCertificate = () => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
      null
    );
    const [selectedTypeTemplate, setSelectedTypeTemplate] =
      useState<Certificate | null>(null);

    return (
      <article className="h-[500px]">
        <AsideLayout>
          <div className="flex flex-col gap-5">
            <InputTemplates
              value={selectedTemplate?.name}
              onSelectionChange={setSelectedTemplate}
            />

            <InputTypeTemplate
              certificates={selectedTemplate?.certificates || []}
              selectedCertificate={selectedTypeTemplate}
              onSelectionChange={setSelectedTypeTemplate}
            />
            <Button>Crear certificado</Button>
          </div>
          <CertificateVisualizer url={selectedTypeTemplate?.url} />
        </AsideLayout>
      </article>
    );
  };

  const TabsComponent = () => {
    return (
      <Tabs aria-label="Options">
        <Tab key="Certificates" title="Certificados">
          <CertificateList />
        </Tab>
        <Tab key="Create" title="Crear nuevo certificado">
          <CreateCertificate />
        </Tab>
      </Tabs>
    );
  };

  return (
    <Modal {...props}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Creacion Masiva de Certificados
            </ModalHeader>
            <ModalBody>
              <Input value={data?.fullname} name="fullname" />
              <TabsComponent />

              {/* <article className="flex gap-3 overflow-x-auto bg-red-400 h-[300px] w-full">
                {data?.certificates ? (
                  data.certificates.map((certificate) => (
                    <span
                      key={certificate.id}
                      className="min-w-[300px] flex flex-col gap-3 p-2"
                    >
                      <Input value={certificate.event} />
                      <img src={certificate.url} className="w-[700px] h-full" />
                    </span>
                  ))
                ) : (
                  <p>No tiene certificados</p>
                )}
              </article> */}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
