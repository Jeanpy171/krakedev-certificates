import { IconType } from "react-icons";
import { Link } from "react-router-dom";

export default function SidebarItem({
  expanded,
  title,
  icon: Icon,
  path,
  active,
}: {
  expanded: boolean;
  icon: IconType;
  title: string;
  path: string;
  active: boolean;
}) {
  return (
    <Link
      to={path}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium cursor-pointer border-1 border-slate-400
        transition-colors group shadow-md
        ${
          active
            ? "bg-purple-500 text-slate-200 rounded-full"
            : "hover:bg-purple-600 hover:text-slate-200"
        }
        ${expanded ? "rounded-md" : "rounded-full"}
    `}
    >
      {<Icon size={18} />}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-36 ml-3" : "w-0"
        }`}
      >
        {title}
      </span>

      {!expanded && (
        <div
          className={`
          absolute top-full md:mt-0 md:top-0 md:left-full md:ml-6 mt-2 z-auto rounded-md px-2 py-1 
          bg-indigo-100 text-blue-600 text-xs md:text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {title}
        </div>
      )}
    </Link>
  );
}
