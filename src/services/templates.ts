import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Template } from "../interface/template";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { Certificate } from "../interface/certificate";

export const handleGetAllTemplates = async (): Promise<Template[]> => {
  try {
    const filter = query(collection(db, "templates"));
    const querySnapshot = await getDocs(filter);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Template[];
  } catch (error) {
    console.log("Error al traer todas las plantillas");
    throw error;
  }
};

export const handleCreateTemplate = async (template: Template) => {
  try {
    if (!template) throw new Error("Debes proporcionar la plantilla");
    if (!template.certificates || template.certificates.length === 0) {
      throw new Error("La plantilla debe tener al menos un certificado");
    }

    // Subir todos los certificados y esperar que se complete
    const updatedCertificates = await Promise.all(
      template.certificates.map(async (certificate) => {
        const { file } = certificate;

        if (file?.file) {
          console.warn(
            "EMPEZANDO A SUBIR LOS CERTIFICADOS A FIREBASE - - - - -"
          );

          // Subir el PDF y obtener la URL
          const pdfUrl = await uploadPdfToFirebase(
            file.file,
            `plantillas/${certificate.event}`,
            certificate.type
          ).catch((error) => {
            console.error("Error al subir el certificado:", error);
            return null; // Devuelve null si hubo un error al subir el archivo
          });

          // Eliminamos la propiedad `file` y actualizamos el objeto del certificado
          const updatedCertificate = {
            ...certificate,
            url: pdfUrl || certificate.url, // Usa la URL original si hubo error
          };
          delete updatedCertificate.file;

          // Devolvemos el certificado sin el archivo
          return updatedCertificate;
        }

        return certificate;
      })
    );

    // Crear la plantilla con los certificados actualizados
    const templateWithCertificates = {
      ...template,
      certificates: updatedCertificates,
    };
    // Crear la referencia al documento con ID personalizado
    const templateRef = doc(db, "templates", template.id);
    console.warn("ESTO SE VA PARA FIREBASE: ", templateWithCertificates);

    // Agregar el documento con el ID personalizado
    await setDoc(templateRef, templateWithCertificates);
    return templateRef;
  } catch (error) {
    console.error("Error al añadir nueva plantilla:", error);
    throw new Error(
      `Error al añadir plantilla: ${
        error instanceof Error ? error.message : ""
      }`
    );
  }
};

export const handleUpdateTemplate = async (
  id: string,
  certificates: Certificate[]
) => {
  try {
    if (!certificates || certificates.length === 0) {
      throw new Error("La plantilla debe tener al menos un certificado");
    }

    // Subir todos los certificados y esperar que se complete
    const updatedCertificates = await Promise.all(
      certificates.map(async (certificate) => {
        const { file } = certificate;

        if (file?.file) {
          console.warn(
            "EMPEZANDO A SUBIR LOS CERTIFICADOS A FIREBASE - - - - -"
          );

          // Subir el PDF y obtener la URL
          const pdfUrl = await uploadPdfToFirebase(
            file.file,
            `plantillas/${certificate.event}`,
            certificate.type
          ).catch((error) => {
            console.error("Error al subir el certificado:", error);
            return null; // Devuelve null si hubo un error al subir el archivo
          });

          // Eliminamos la propiedad `file` y actualizamos el objeto del certificado
          const updatedCertificate = {
            ...certificate,
            url: pdfUrl || certificate.url, // Usa la URL original si hubo error
          };
          delete updatedCertificate.file;

          // Devolvemos el certificado sin el archivo
          return updatedCertificate;
        }

        return certificate;
      })
    );

    // Agregar el documento con el ID personalizado
    await updateDoc(doc(db, "templates", id), {
      certificates: updatedCertificates,
    });
  } catch (error) {
    console.error("Error al añadir nueva plantilla:", error);
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

    // Obtiene la URL de descarga del archivo subido
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    throw new Error("Error al subir el archivo. Intenta nuevamente.");
  }
};

// export const handleGetStudentByEmail = async (email: string) => {
//   if (!email) {
//     throw new Error("Debes proporcionar el email");
//   }

//   try {
//     const filter = query(collection(db, "students"), where("email", "==", email))
//     const querySnapshot = await getDocs(filter)
//     if (querySnapshot.empty) throw new Error("No se ha encontrado el correo electronico")
//     const { id, data } = querySnapshot.docs[0]
//     const studentDocument = { id, ...data() }
//     return studentDocument
//   } catch (error) {
//     console.log("Error al consultar la info del estudiante")
//     throw error
//   }
// }
