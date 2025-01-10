import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import { Certificate } from "../../../../../interface/certificate";
import { Key } from "react";

interface InputTypeTemplate
  extends Omit<
    AutocompleteProps<Certificate>,
    "children" | "onSelectionChange"
  > {
  certificates: Certificate[];
  selectedCertificate?: Certificate | null;
  onSelectionChange?: (arg: Certificate | null) => void;
}

export const InputTypeTemplate = ({
  certificates,
  selectedCertificate,
  onSelectionChange,
  ...props
}: InputTypeTemplate) => {
  const handleSelection = (e: Key | null) => {
    if (onSelectionChange) {
      const certificate = certificates.find(
        (certificate) => certificate.id === e
      );
      onSelectionChange(certificate || null);
    }
  };

  return (
    <Autocomplete
      label="Selecciona el tipo de plantilla"
      onSelectionChange={handleSelection}
      {...props}
      value={selectedCertificate?.name}
    >
      {certificates.map((certificate) => (
        <AutocompleteItem key={certificate.id}>
          {certificate.name}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
