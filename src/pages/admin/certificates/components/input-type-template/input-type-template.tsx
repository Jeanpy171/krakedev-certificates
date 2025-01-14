import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import { Key } from "react";
import { Template } from "../../../../../interface/template";

interface InputTypeTemplate
  extends Omit<AutocompleteProps<Template>, "children" | "onSelectionChange"> {
  templates: Template[];
  selectedTemplate?: Template | null;
  onSelectionChange?: (arg: Template | null) => void;
}

export const InputTypeTemplate = ({
  templates,
  selectedTemplate,
  onSelectionChange,
  ...props
}: InputTypeTemplate) => {
  const handleSelection = (e: Key | null) => {
    if (onSelectionChange) {
      const certificate = templates.find((certificate) => certificate.id === e);
      onSelectionChange(certificate || null);
    }
  };

  return (
    <Autocomplete
      label="Selecciona el tipo de plantilla"
      onSelectionChange={handleSelection}
      {...props}
      value={selectedTemplate?.range}
    >
      {templates.map((certificate) => (
        <AutocompleteItem key={certificate.id}>
          {certificate.range}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};
