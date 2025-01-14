import { Tab, Tabs } from "@nextui-org/tabs";
import CertificateList from "./components/certificate-list/certificate-list";
import CreateCertificate from "./components/create-certificate/create-certificate";
import { Toaster } from "sonner";

export const Certificates = () => {
  const TabsComponent = () => {
    return (
      <Tabs aria-label="Options">
        <Tab key="Certificates" title="Certificados" className="w-full">
          <CertificateList />
        </Tab>
        <Tab key="Create" title="Crear nuevo certificado" className="w-full">
          <CreateCertificate />
        </Tab>
      </Tabs>
    );
  };

  return (
    <main className="h-full flex flex-col p-5 justify-start items-center gap-3">
      <Toaster />
      <h3 className="text-3xl font-bold">
        Administracion de Certificados KRAKEDEV
      </h3>
      <TabsComponent />
    </main>
  );
};
