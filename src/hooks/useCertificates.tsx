import { useEffect, useState } from "react";
import { Certificate } from "../interface/certificate";
import { handleGetAllCertificates } from "../services/certificates";

export default function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSetCertificates();
  }, []);

  const handleSetCertificates = async () => {
    setIsLoading(true);
    const certificates = await handleGetAllCertificates();
    setCertificates(certificates || []);
    setIsLoading(false);
  };

  return { certificates, isLoading };
}
