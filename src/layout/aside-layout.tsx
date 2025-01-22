import { ReactNode } from "react";

export const AsideLayout = (props: {
  children: ReactNode[];
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row h-full w-full gap-3 ${props.className}`}
    >
      <section className="flex w-full md:w-2/5 h-full">
        {props.children[0]}
      </section>
      <aside className="flex w-full md:w-3/5 h-full">{props.children[1]}</aside>
    </div>
  );
};
