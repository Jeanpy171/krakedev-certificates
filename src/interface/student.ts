import { Timestamp } from "firebase/firestore";

export interface Student {
  id: string;
  fullname: string;
  email: string;
  observation?: string;
  updated_at?: Timestamp;
  created_at?: Timestamp;
  status?: string;
  certificates: CertificateStudent[] | null;
}

export interface CertificateStudent {
  name: string;
  range: string;
  id_certificate: string;
  id_template: string;
  url?: string;
  created_at: Timestamp;
}
