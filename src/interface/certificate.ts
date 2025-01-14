import { Template } from "./template";

export interface Certificate {
  id: string;
  name: string;
  templates: Template[];
  created_at: string;
  is_active: boolean;
}
