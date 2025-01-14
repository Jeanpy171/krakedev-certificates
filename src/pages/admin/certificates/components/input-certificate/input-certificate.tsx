import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import { Key, useEffect } from "react";
import { Certificate } from "../../../../../interface/certificate";
import useCertificateStore from "../../../../../store/certificates";

interface InputTemplate
  extends Omit<
    AutocompleteProps<Certificate>,
    "children" | "onSelectionChange"
  > {
  selectedCertificate?: Certificate | null;
  onSelectionChange?: (arg: Certificate | null) => void;
}

export const InputCertificates = ({
  onSelectionChange,
  ...props
}: InputTemplate) => {
  const { certificates, isLoadingCertificates, fetchCertificates } =
    useCertificateStore();

  useEffect(() => {
    if (certificates.length === 0) {
      fetchCertificates();
    }
  }, [certificates, fetchCertificates]);

  const handleSelection = (e: Key | null) => {
    if (onSelectionChange) {
      const certificate = certificates.find((template) => template.id === e);
      onSelectionChange(certificate || null);
    }
  };
  return (
    <Autocomplete
      isLoading={isLoadingCertificates}
      defaultItems={Array.isArray(certificates) ? certificates : []}
      label="Selecciona la plantilla"
      onSelectionChange={handleSelection}
      {...props}
    >
      {certificates.map((type) => (
        <AutocompleteItem key={type.id}>{type.name}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
