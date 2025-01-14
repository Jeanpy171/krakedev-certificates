export interface Template {
  id: string;
  certificate: string;
  range: string;
  file?: { path: string; file: File } | null;
  url?: string | null;
  created_at?: string;
}
