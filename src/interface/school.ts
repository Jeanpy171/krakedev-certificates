import { Template } from "./template";

export interface School {
  id: string;
  name: string;
  certificates: Template[] | null;
  created_at: string;
}
