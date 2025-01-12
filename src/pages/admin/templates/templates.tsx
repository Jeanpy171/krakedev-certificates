import { Tab, Tabs } from "@nextui-org/tabs";
import TemplateList from "./components/template-list/template-list";
import CreateTemplate from "./components/create-template/create-template";

export const Templates = () => {
  const TabsComponent = () => {
    return (
      <Tabs aria-label="Options">
        <Tab key="Certificates" title="Certificados" className="w-full">
          <TemplateList />
        </Tab>
        <Tab key="Create" title="Crear nuevo certificado" className="w-full">
          <CreateTemplate />
        </Tab>
      </Tabs>
    );
  };

  return (
    <main className="h-full flex flex-col p-5 justify-start items-center gap-3">
      <h3 className="text-3xl font-bold">
        Administracion de Certificados KRAKEDEV
      </h3>
      <TabsComponent />
    </main>
  );
};
