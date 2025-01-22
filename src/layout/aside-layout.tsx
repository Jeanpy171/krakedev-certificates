import { ReactNode } from "react";

export const AsideLayout = (props: {
  children: ReactNode[];
  className?: string;
}) => {
  return (
    <div
      className={`flex flex-col md:flex-row h-full w-full gap-3 ${props.className}`}
    >
      <section className="flex h-2/5 w-full md:w-2/5 md:h-full">
        {props.children[0]}
      </section>
      <aside className="flex h-3/5 w-ful md:w-3/5 md:h-full">{props.children[1]}</aside>
    </div>
  );
};
