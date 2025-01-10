import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import useTemplates from "../../../../../hooks/useTemplates";
import { Key } from "react";
import { Template } from "../../../../../interface/template";

interface InputTemplate
  extends Omit<AutocompleteProps<Template>, "children" | "onSelectionChange"> {
  selectedTemplate?: Template | null;
  onSelectionChange?: (arg: Template | null) => void;
}

export const InputTemplates = ({
  onSelectionChange,
  ...props
}: InputTemplate) => {
  const { templates, isLoading } = useTemplates();

  const handleSelection = (e: Key | null) => {
    if (onSelectionChange) {
      const template = templates.find((template) => template.id === e);
      onSelectionChange(template || null);
    }
  };
  return (
      <Autocomplete
        isLoading={isLoading}
        defaultItems={Array.isArray(templates) ? templates : []}
        label="Selecciona la plantilla"
        onSelectionChange={handleSelection}
        {...props}
      >
        {templates.map((type) => (
          <AutocompleteItem key={type.id}>{type.name}</AutocompleteItem>
        ))}
      </Autocomplete>
  );
};
