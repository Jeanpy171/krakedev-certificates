import { create } from "zustand";
import { handleGetAllCertificates } from "../services/certificates";
import { Certificate } from "../interface/certificate";

export interface CertificateStore {
  certificates: Certificate[];
  isLoadingCertificates: boolean;
  errorCertificates: string | null;
  fetchCertificates: () => Promise<void>;
  setCertificates: (arg0: Certificate[]) => void;
}

const useCertificateStore = create<CertificateStore>((set) => ({
  certificates: [],
  isLoadingCertificates: false,
  errorCertificates: null,
  setCertificates: (certificates) => {
    set({ certificates });
  },
  fetchCertificates: async () => {
    //const { certificates } = get();
    //if (certificates.length > 0) return;

    set({ isLoadingCertificates: true, errorCertificates: null });

    try {
      const response = await handleGetAllCertificates();
      set({ certificates: response, isLoadingCertificates: false });
    } catch (error) {
      set({
        errorCertificates: "Error al cargar los certificados: " + error,
        isLoadingCertificates: false,
      });
    }
  },
}));

export default useCertificateStore;
