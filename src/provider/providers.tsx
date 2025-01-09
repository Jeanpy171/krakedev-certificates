import { ReactNode } from "react";
import { NextUIProvider } from "@nextui-org/system";

export default function Providers(props: { children: ReactNode }) {
  return <NextUIProvider>{props.children}</NextUIProvider>;
}
