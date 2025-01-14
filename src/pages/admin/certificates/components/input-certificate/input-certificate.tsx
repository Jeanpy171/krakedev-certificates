import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import { Key, useEffect, useState } from "react";
import { Certificate } from "../../../../../interface/certificate";
import useCertificateStore from "../../../../../store/certificates";

interface InputTemplate
  extends Omit<
    AutocompleteProps<Certificate>,
    "children" | "onSelectionChange"
  > {
  selectedCertificate?: Certificate | null;
  filterByActive: boolean;
  onSelectionChange?: (arg: Certificate | null) => void;
}

export const InputCertificates = ({
  onSelectionChange,
  filterByActive = false,
  ...props
}: InputTemplate) => {
  const {
    certificates,
    isLoadingCertificates,
    fetchCertificates,
    errorCertificates,
  } = useCertificateStore();

  const [filteredCertificates, setFilteredCertificates] = useState<
    Certificate[]
  >([]);

  useEffect(() => {
    if (certificates.length === 0 && !errorCertificates) {
      fetchCertificates();
    }
  }, [fetchCertificates, certificates.length, errorCertificates]);

  useEffect(() => {
    if (filterByActive) {
      setFilteredCertificates(
        certificates.filter((certificate) => certificate.is_active)
      );
    } else {
      setFilteredCertificates(certificates);
    }
  }, [filterByActive, certificates]);

  const handleSelection = (e: Key | null) => {
    if (onSelectionChange) {
      const certificate = certificates.find((template) => template.id === e);
      onSelectionChange(certificate || null);
    }
  };

  return (
    <Autocomplete
      isLoading={isLoadingCertificates}
      defaultItems={filteredCertificates}
      label="Seleccione el certificado"
      onSelectionChange={handleSelection}
      {...props}
      listboxProps={{ emptyContent: "No se encontraron certificaciones" }}
    >
      {filteredCertificates.map((type) => (
        <AutocompleteItem key={type.id}>{type.name}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
