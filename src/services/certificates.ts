import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Certificate } from "../interface/certificate";
import { getCurrentDate } from "../utils/date";

export const handleGetAllCertificates = async (): Promise<Certificate[]> => {
  try {
    const filter = query(collection(db, "certificates"));
    const querySnapshot = await getDocs(filter);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Certificate[];
  } catch (error) {
    console.log("Error al traer todas las plantillas");
    throw error;
  }
};

export const handleGetCertificateById = async (
  id: string
): Promise<Certificate | null> => {
  try {
    const filter = query(collection(db, "certificates"), where("id", "==", id));
    const querySnapshot = await getDocs(filter);

    if (querySnapshot.empty) {
      //throw new Error("No se ha encontrado el correo electrónico");
      return null;
    }

    const document = querySnapshot.docs[0];
    const data = document.data() as Certificate;

    return data;
  } catch (error) {
    console.log("Error al traer el certificado");
    throw error;
  }
};

export const handleCreateCertificate = async (certificate: Certificate) => {
  try {
    if (!certificate) throw new Error("Debes proporcionar el certificado");
    if (!certificate.templates || certificate.templates.length === 0) {
      throw new Error("El certificado debe tener al menos una plantilla");
    }
    console.warn("ESTO ME LLEGA A CREAR CERTIFICADO: ", certificate);
    const updatedCertificates = await Promise.all(
      certificate.templates.map(async (template) => {
        const { file } = template;

        if (file?.file) {
          console.warn(
            "EMPEZANDO A SUBIR LOS CERTIFICADOS A FIREBASE - - - - -"
          );

          const pdfUrl = await uploadPdfToFirebase(
            file.file,
            `certificados/${template.certificate}`,
            template.range
          ).catch((error) => {
            console.error("Error al subir el certificado:", error);
            return null;
          });

          const updatedTemplate = {
            ...template,
            url: pdfUrl || template.url,
          };
          delete updatedTemplate.file;

          return updatedTemplate;
        }

        return certificate;
      })
    );

    const certificateWithTemplates = {
      ...certificate,
      templates: updatedCertificates,
    };
    const certificateRef = doc(db, "certificates", certificate.id);
    console.warn("ESTO SE VA PARA FIREBASE: ", certificateWithTemplates);
    await setDoc(certificateRef, certificateWithTemplates);
    return certificateRef;
  } catch (error) {
    console.error("Error al añadir nueva plantilla:", error);
    throw new Error(
      `Error al añadir plantilla: ${
        error instanceof Error ? error.message : ""
      }`
    );
  }
};

export const handleUpdateCertificate = async (
  id: string,
  updateCertificate: Partial<Certificate>
) => {
  try {
    if (
      !updateCertificate.templates ||
      updateCertificate.templates.length === 0
    ) {
      throw new Error("El certificado debe tener al menos una plantilla");
    }

    const updatedTemplates = await Promise.all(
      updateCertificate.templates.map(async (template) => {
        const { file } = template;

        if (file?.file) {
          console.warn(
            "EMPEZANDO A SUBIR LOS CERTIFICADOS A FIREBASE - - - - -"
          );

          const pdfUrl = await uploadPdfToFirebase(
            file.file,
            `certificados/${updateCertificate.name}`,
            template.range
          ).catch((error) => {
            console.error("Error al subir el certificado:", error);
            return null;
          });

          const updatedTemplate = {
            ...template,
            name: updateCertificate.name,
            url: pdfUrl || template.url, 
          };
          delete updatedTemplate.file;

          return updatedTemplate;
        }

        return template;
      })
    );

    await updateDoc(doc(db, "certificates", id), {
      name: updateCertificate.name,
      templates: updatedTemplates,
      updated_at: getCurrentDate(),
    });
  } catch (error) {
    console.error("Error al añadir nuevas plantilla:", error);
    throw new Error(
      `Error al añadir plantilla: ${
        error instanceof Error ? error.message : ""
      }`
    );
  }
};

export const uploadPdfToFirebase = async (
  file: File | null,
  folder: string,
  name: string
): Promise<string> => {
  if (!file || file.type !== "application/pdf") {
    throw new Error("El archivo debe ser un PDF.");
  }

  try {
    const storage = getStorage();
    const storageRef = ref(storage, `${folder}/${name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo. Intenta nuevamente.");
  }
};
