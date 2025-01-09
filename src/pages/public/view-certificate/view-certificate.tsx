import { Button } from "@nextui-org/button";
import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Certificates, Student } from "../../../interface/student";
import { Input } from "@nextui-org/input";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";

const ViewCertificate = () => {
  const { state } = useLocation();
  console.log("DATA QUE RECIBO DE LA BUSQUEDA: ", state);
  const data: Student = state;
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificates | null>(
      (data?.certificates && data?.certificates[0]) || null
    );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const onSelectionChange = (key: unknown) => {
    console.log("NOMBRE: ", key);
    const certificateData = data.certificates?.find(
      (certificate) => certificate.id === key
    );
    console.log("FILTRADO: ", certificateData);
    if (certificateData) setSelectedCertificate(certificateData);
  };
  return (
    <main className="h-full flex flex-col gap-5 justify-start items-center p-5">
      <h3 className="text-3xl font-bold">{`Bienvenido ${data.fullname}`}</h3>
      <article className="flex w-full flex-1">
        <section className="w-2/5 flex flex-col gap-4 justify-start items-start p-10">
          <h4>Encuentras fallos en el nombre? Edita la informacion aqui</h4>

          <form className="flex flex-col gap-4 w-full">
            <Input value={data.fullname} name="fullname" />
            <Button>Actualizar</Button>
          </form>
          {data?.certificates ? (
            <Autocomplete
              label={"Selecciona el certificado"}
              value={selectedCertificate?.name}
              selectedKey={selectedCertificate?.id}
              onSelectionChange={onSelectionChange}
            >
              {data.certificates?.map((certificate) => (
                <AutocompleteItem key={certificate.id}>
                  {certificate.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          ) : (
            <p>No se hay registrado certificados para ti</p>
          )}
        </section>

        <section className="w-3/5 flex justify-center items-center">
          {selectedCertificate ? (
            <>
              <iframe
                ref={iframeRef}
                src={selectedCertificate?.file}
                width="100%"
                height="100%"
                title="PDF Preview"
              />
            </>
          ) : (
            <p className="text-gray-500">Cargando PDF...</p>
          )}
        </section>
      </article>
    </main>
  );
};

export default ViewCertificate;
