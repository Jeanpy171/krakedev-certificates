import { ReactNode } from "react";

export const AsideLayout = (props: { children: ReactNode[] }) => {
  return (
    <div className="flex h-full w-full">
      <section className="flex w-2/5">{props.children[0]}</section>
      <aside className="flex w-3/5">{props.children[1]}</aside>
    </div>
  );
};
