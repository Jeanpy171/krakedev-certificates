import { Ranges } from "../interface/ranges";

const rangeIds = [
  Ranges.novice,
  Ranges.beginner,
  Ranges.intermediate,
  Ranges.advanced,
  Ranges.finalist,
];

const generateTemplates = (
  category: string
): { id: string; file: string }[] => {
  return rangeIds.map((range) => ({
    id: range,
    file: `assets/${category}/${range.toLowerCase()}.pdf`,
  }));
};

export const templates = {
  interschool_2: generateTemplates("interschool_2"),
  interschool_3: generateTemplates("interschool_3"),
};
