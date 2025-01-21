import { useCallback, useEffect, useState } from "react";
import { CertificateVisualizer } from "../certificate-visualizer/certificate-visualizer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

// const getCustomFontFromUrl = async () => {
//   try {
//     const fontUrl =
//       "https://firebasestorage.googleapis.com/v0/b/krakedev-certificates.firebasestorage.app/o/fuentes%2FGreatVibes-Regular.ttf?alt=media&token=9fe02af5-cbb9-440b-b0c0-26c4a2e493b5";

//     // const fontUrl =
//     //   "https://drive.google.com/uc?export=download&id=1kPsHNujehJXMYW9XS2sv1SxUiM0y290C";
//     const fontBytes = await fetch(fontUrl).then((res) => {
//       if (!res.ok) {
//         throw new Error(`Error al cargar la fuente: ${res.statusText}`);
//       }
//       return res.arrayBuffer();
//     });
//     console.warn("ESTO TE DEVUELVO DE UTRL: ", fontBytes);
//     return fontBytes;
//   } catch (error) {
//     console.error(error);
//     throw new Error("No se pudo cargar la fuente.");
//   }
// };

const formatName = (fullname: string) => {
  if (!fullname) return "";
  return fullname
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const CertificateWritter = ({
  url,
  fullname,
  onSetPdf,
}: {
  url: string | null;
  fullname: string;
  onSetPdf?: (arg: string) => void;
}) => {
  const [pdfUrl, setPdfUrl] = useState(url);

  const generatePdf = useCallback(async () => {
    if (!url || !fullname) return;

    try {
      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      pdfDoc.registerFontkit(fontkit);

      // const customFontBytes = await getCustomFontFromUrl();

      // const customFont = await pdfDoc.embedFont(customFontBytes, {
      //   subset: true,
      // });

      const timesRomanItalic = await pdfDoc.embedFont(
        StandardFonts.TimesRomanBoldItalic
      );

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      const fontSize = 40;
      const textWidth = fullname.length * fontSize * 0.45;
      const centeredX = width / 2 - textWidth / 2;
      const centerY = height / 2;

      const formattedName = formatName(fullname);

      firstPage.drawText(formattedName, {
        x: centeredX,
        y: centerY,
        size: fontSize,
        font: timesRomanItalic,
        color: rgb(0, 0, 0),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      const newUrlPDF = URL.createObjectURL(blob);
      setPdfUrl(newUrlPDF);

      if (onSetPdf) onSetPdf(newUrlPDF);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
    }
  }, [url, fullname, onSetPdf]);

  useEffect(() => {
    generatePdf();
  }, [url, fullname, generatePdf]);

  return (
    <article className="w-full h-full flex justify-center items-center overflow-hidden">
      {url ? (
        <CertificateVisualizer url={pdfUrl} />
      ) : (
        <p>Esperando plantilla</p>
      )}
    </article>
  );
};

export default CertificateWritter;
