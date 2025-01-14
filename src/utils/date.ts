import { Timestamp } from "firebase/firestore";

export const getCurrentDate = () => {
  const now = new Date();
  const ecuadorDate = new Date(now.setHours(now.getHours()));
  return Timestamp.fromDate(ecuadorDate);
};
