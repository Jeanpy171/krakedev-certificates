import { Input } from "@nextui-org/input";
import { Certificate } from "../../../../../interface/certificate";
import Dropzone from "../../../../../components/dropzone/dropzone";
import { CertificateVisualizer } from "../../../../../components/certificate-visualizer/certificate-visualizer";
import { IoMdClose } from "react-icons/io";

const CertificateCard = ({
  certificate,
  onChange,
  deleteCertificate,
}: {
  certificate: Certificate;
  onChange: (field: string, value: Certificate) => void;
  deleteCertificate: () => void;
}) => {
  const accept = { "application/pdf": [".pdf"] };
  const handleReaderFiles = (acceptedFiles: File[]) => {
    acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.onload = function () {
        const path = reader.result as string;
        onChange("certificates", {
          ...certificate,
          file: { path, file },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSelectedFile = () => {
    onChange("certificates", {
      ...certificate,
      file: null,
      url: null,
    });
  };

  return (
    <div className="flex flex-col relative w-[300px] h-[330px] border rounded p-4 py-10 shadow gap-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteCertificate();
        }}
        className="absolute top-2 right-2 z-50 bg-red-400 rounded-sm"
      >
        <IoMdClose size={20} color="white" />
      </button>
      <Input
        placeholder="Tipo de certificado"
        value={certificate.type}
        onChange={(e) =>
          onChange("certificates", { ...certificate, type: e.target.value })
        }
      />
      <Dropzone
        accept={accept}
        handleReaderFiles={handleReaderFiles}
        handleRemoveSelectedFile={handleRemoveSelectedFile}
        multiple={false}
        onDroppingText="Arrastra y suelta o presiona aquí para sobrescribir el pdf del certificado"
        onHoverText="Arrastra y suelta o presiona aquí para cargar el pdf del certificado"
        file={certificate.file || certificate.url}
        className="flex w-full h-full rounded-md justify-center items-center bg-gray-300 "
        disabled={false}
      >
        {certificate.url || certificate.file ? (
          <CertificateVisualizer
            url={certificate.url || certificate.file?.path}
          />
        ) : (
          <p>No PDF selected</p>
        )}
      </Dropzone>
    </div>
  );
};

export default CertificateCard;
