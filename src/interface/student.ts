import { Certificate } from "./certificate";

export interface Student {
  id: string;
  fullname: string;
  email: string;
  range: string;
  certificates: Certificate[] | null;
}
