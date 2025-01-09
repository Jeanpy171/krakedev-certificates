import { useEffect, useState } from "react";
import { School } from "../interface/school";
import { handleFetchSchools } from "../services/schools";

export default function useSchools() {
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    handleSetSchools();
  }, []);

  const handleSetSchools = async () => {
    const schools = await handleFetchSchools();
    setSchools(schools);
  };

  return { schools };
}
