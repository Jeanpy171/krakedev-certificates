import { ReactNode } from "react";
import MainNavbar from "../components/navbar/navbar";

const MainLayout = (props: { children: ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <MainNavbar />
      <div className="flex-1 h-dvh">{props.children}</div>
    </div>
  );
};

export default MainLayout;
