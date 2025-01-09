import { Input } from "@nextui-org/input";
import InputRol from "./components/input-rol/input-rol";
import Slider from "./components/slider/slider";
import { Button } from "@nextui-org/button";
import InformationCard from "./components/information-card/information-card";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../../navigation/routes";
import { searchByEmail } from "../../../services/students";
import InputSchool from "./components/input-school/input-school";

const SearchEntitie = () => {
  const navigate = useNavigate();
  const [selectedRol, setSelectedRol] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email");

    if (!email || typeof email !== "string") {
      console.error("El campo email es requerido.");
      return;
    }

    console.log("Email:", email);
    const filterData = await searchByEmail(email);
    if (filterData) {
      navigate(Routes.public.routes.view_certificate.path, {
        state: filterData,
      });
    } else {
      alert("NO SE ENCUENTRA AL ESTUDIANTE");
    }
  };

  const handleOnSelectionRol = (key: unknown) => {
    setSelectedRol(key as string);
  };

  return (
    <main className="h-full flex flex-col gap-5 justify-start items-center p-5">
      <h3 className="text-3xl font-bold">Consulta de Certificados KRAKEDEV</h3>
      <article className="flex w-full flex-1">
        <section className="w-2/5 flex flex-col gap-4 justify-start items-start p-10">
          <InformationCard />
          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
            <InputRol
              onSelectionChange={handleOnSelectionRol}
              value={selectedRol ?? ""}
            />
            {selectedRol !== "school" ? (
              <Input
                label="Email"
                name="email"
                placeholder="Digita tu correo electrónico"
                type="email"
              />
            ) : (
              <InputSchool />
            )}
            <Button type="submit">Buscar</Button>
          </form>
        </section>

        <section className="w-3/5 flex justify-center items-center">
          <Slider />
        </section>
      </article>
    </main>
  );
};

export default SearchEntitie;
