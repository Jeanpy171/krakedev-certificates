import { IoMdAdd } from "react-icons/io";
import { Template } from "../../../../../interface/template";
import TemplateCard from "../template-card/template-card";

const templateButtonStyles =
  "flex-shrink-0 w-[300px] h-[330px] flex flex-col gap-3 justify-center items-center border rounded p-4 shadow";

const TemplateList = ({
  isEditable,
  templates,
  handleOnChange,
  addTemplate,
  deleteTemplate,
}: {
  isEditable: boolean;
  templates: Template[];
  handleOnChange: (field: string, value: string | Template) => void;
  addTemplate: () => void;
  deleteTemplate: (arg0: string) => void;
}) => {
  return (
    <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] place-items-center items-center">
      {templates.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {templates.map((template, index) => (
            <TemplateCard
              template={template}
              key={template.id + "_" + index}
              onChange={handleOnChange}
              deleteCertificate={() => deleteTemplate(template.id)}
            />
          ))}
          {isEditable && (
            <li className="flex-shrink-0 w-[300px]">
              <button onClick={addTemplate} className={templateButtonStyles}>
                <IoMdAdd size={40} />
                <strong>Añadir plantilla</strong>
              </button>
            </li>
          )}
        </ul>
      ) : (
        isEditable && (
          <button onClick={addTemplate} className={templateButtonStyles}>
            <IoMdAdd size={40} />
            <strong>Añadir plantilla</strong>
          </button>
        )
      )}
    </article>
  );
};

export default TemplateList;
