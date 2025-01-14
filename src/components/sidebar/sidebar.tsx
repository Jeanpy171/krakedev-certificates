import { useState } from "react";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import SidebarItem from "./components/sidebar-item";
import { useLocation } from "react-router-dom";
import { IconType } from "react-icons";

export default function Sidebar({
  modules,
}: {
  modules: { title: string; icon: IconType; path: string }[];
}) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();
  const currentPath = location.pathname.split("/");
  console.warn("CURRENT PATH: ", currentPath);
  return (
    <aside>
      <nav
        className={`h-full flex ${
          expanded && "overflow-auto"
        } md:flex-col border-r shadow-sm items-center`}
      >
        <div
          className={`p-2 flex justify-center md:justify-start items-center w-14 md:w-full h-20`}
        >
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className={`p-2.5 bg-gray-50 hover:bg-gray-100 border-1 shadow-md border-gray-400 ${
              expanded ? "rounded-md" : "rounded-full"
            }`}
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <ul className="flex md:flex-col p-2 justify-center items-center gap-3 z-20">
          {modules.map((module, index) => (
            <SidebarItem
              key={module.path + "_" + index}
              expanded={expanded}
              icon={module.icon}
              title={module.title}
              path={module.path}
              active={module.path === currentPath[2]}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
