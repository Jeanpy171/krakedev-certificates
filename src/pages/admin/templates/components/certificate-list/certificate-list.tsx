import { IoMdAdd } from "react-icons/io";
import { Certificate } from "../../../../../interface/certificate";
import CertificateCard from "../certificate-card/certificate-card";

const certificateButtonStyles =
  "flex-shrink-0 w-[330px] h-[330px] flex flex-col gap-3 justify-center items-center border rounded p-4 shadow";

const CertificateList = ({
  certificates,
  handleOnChange,
  addCertificate,
  deleteCertificate,
}: {
  certificates: Certificate[];
  handleOnChange: (field: string, value: string | Certificate) => void;
  addCertificate: () => void;
  deleteCertificate: (arg0: string) => void;
}) => {
  return (
    <article className="overflow-y-auto w-full grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))]">
      {certificates.length > 0 ? (
        <article className="flex gap-4">
          <div className="flex flex-wrap gap-2">
            {certificates.map((certificate) => (
              <CertificateCard
                certificate={certificate}
                key={certificate.id}
                onChange={handleOnChange}
                deleteCertificate={() => deleteCertificate(certificate.id)}
              />
            ))}
          </div>
          <button onClick={addCertificate} className={certificateButtonStyles}>
            <IoMdAdd size={40} />
            <strong>Añadir certificado</strong>
          </button>
        </article>
      ) : (
        <button onClick={addCertificate} className={certificateButtonStyles}>
          <IoMdAdd size={40} />
          <strong>Añadir certificado</strong>
        </button>
      )}
    </article>
  );
};

export default CertificateList;
