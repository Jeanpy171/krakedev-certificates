export interface Certificate {
  id: string;
  event: string;
  type: string;
  file?: { path: string; file: File } | null;
  url?: string | null;
  created_at?: string;
}
