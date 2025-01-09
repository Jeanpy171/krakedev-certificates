import { Certificate } from "./certificate";

export interface School {
  id: string;
  name: string;
  certificates: Certificate[] | null;
  created_at: string;
}
