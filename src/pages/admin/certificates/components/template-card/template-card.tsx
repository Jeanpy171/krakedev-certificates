import { Input } from "@nextui-org/input";
import Dropzone from "../../../../../components/dropzone/dropzone";
import { CertificateVisualizer } from "../../../../../components/certificate-visualizer/certificate-visualizer";
import { IoMdClose } from "react-icons/io";
import { Template } from "../../../../../interface/template";

const TemplateCard = ({
  template,
  onChange,
  deleteCertificate,
}: {
  template: Template;
  onChange: (field: string, value: Template) => void;
  deleteCertificate: () => void;
}) => {
  const accept = { "application/pdf": [".pdf"] };
  const handleReaderFiles = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function () {
        const path = reader.result as string;
        onChange("templates", {
          ...template,
          file: { path, file },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedFile = () => {
    onChange("templates", {
      ...template,
      file: null,
      url: null,
    });
  };

  return (
    <li
      key={template.id}
      className="flex flex-col relative w-[300px] h-[330px] border rounded p-4 py-10 shadow gap-4"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteCertificate();
        }}
        className="absolute top-2 right-2 z-50 rounded-sm bg-red-500"
      >
        <IoMdClose size={20} color="white" />
      </button>
      <Input
        placeholder="Tipo de certificado"
        value={template.range}
        onChange={(e) =>
          onChange("templates", { ...template, range: e.target.value })
        }
      />
      <Dropzone
        accept={accept}
        handleReaderFiles={handleReaderFiles}
        handleRemoveSelectedFile={handleRemoveSelectedFile}
        multiple={false}
        onDroppingText="Arrastra y suelta o presiona aquí para sobrescribir el pdf del certificado"
        onHoverText="Arrastra y suelta o presiona aquí para cargar el pdf del certificado"
        file={template.file || template.url}
        className="flex w-full h-full rounded-md justify-center items-center bg-gray-300 "
        disabled={false}
      >
        {template.url || template.file ? (
          <CertificateVisualizer url={template.url || template.file?.path} />
        ) : (
          <p>No PDF selected</p>
        )}
      </Dropzone>
    </li>
  );
};

export default TemplateCard;
