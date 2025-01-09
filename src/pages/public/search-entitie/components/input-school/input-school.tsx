import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";
import useSchools from "../../../../../hooks/useSchools";

export default function InputSchool({
  ...props
}: Omit<AutocompleteProps, "children">) {
  const { schools } = useSchools();
  return (
    <Autocomplete label="Selecciona o digita tu institucion" {...props}>
      {schools.map((type) => (
        <AutocompleteItem key={type.id}>{type.name}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
