import { School } from "../interface/school";

export const handleFetchSchools = async (): Promise<School[]> => {
  return new Promise(() => {
    setTimeout(() => {
      //resolve(schools);
    }, 3500);
  });
};

