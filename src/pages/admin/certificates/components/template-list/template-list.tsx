import { IoMdAdd } from "react-icons/io";
import { Template } from "../../../../../interface/template";
import TemplateCard from "../template-card/template-card";

const templateButtonStyles =
  "flex-shrink-0 w-[330px] h-[330px] flex flex-col gap-3 justify-center items-center border rounded p-4 shadow";

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
    <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
      {templates.length > 0 ? (
        <article className="flex gap-4">
          <ul className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <TemplateCard
                template={template}
                key={template.id}
                onChange={handleOnChange}
                deleteCertificate={() => deleteTemplate(template.id)}
              />
            ))}
          </ul>
          {isEditable && (
            <button onClick={addTemplate} className={templateButtonStyles}>
              <IoMdAdd size={40} />
              <strong>Añadir plantilla</strong>
            </button>
          )}
        </article>
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
