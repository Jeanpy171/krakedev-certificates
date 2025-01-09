import { School } from "../interface/school";
import { schools } from "./schools.mock";

export const handleFetchSchools = async (): Promise<School[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(schools);
    }, 3500);
  });
};

