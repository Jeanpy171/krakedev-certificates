import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../../navigation/routes";
import { AsideLayout } from "../../../layout/aside-layout";
import Slider from "../../../components/slider/slider";
import { handleLogin } from "../../../services/auth";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      console.error("El campo email es requerido.");
      return;
    }

    console.log("Email:", email);
    setIsLoading(true);
    try {
      await handleLogin(email, password);
      navigate(Routes.admin.path)
    } catch (error) {
      alert(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-full flex flex-col gap-5 justify-start items-center p-5">
      <h3 className="text-3xl font-bold">
        Administracion de Certificados KRAKEDEV
      </h3>
      <AsideLayout>
        <div className="flex flex-col gap-4 justify-start items-start p-10 w-full">
          <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
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
          </form>
        </div>
        <Slider />
      </AsideLayout>
    </main>
  );
};

export default SignIn;
