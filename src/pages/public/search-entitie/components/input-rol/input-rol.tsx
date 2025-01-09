import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteProps,
} from "@nextui-org/autocomplete";

const rolType = [
  {
    key: "student",
    label: "Estudiante",
  },
  {
    key: "parent",
    label: "Familiar",
  },
  {
    key: "school",
    label: "Institución",
  },
];

export default function InputRol({
  ...props
}: Omit<AutocompleteProps, "children">) {
  return (
    <Autocomplete label="Selecciona tu tipo de rol" {...props}>
      {rolType.map((type) => (
        <AutocompleteItem key={type.key}>{type.label}</AutocompleteItem>
      ))}
    </Autocomplete>
  );
}
