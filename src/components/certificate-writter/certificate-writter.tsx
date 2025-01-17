import { useCallback, useEffect, useState } from "react";
import { CertificateVisualizer } from "../certificate-visualizer/certificate-visualizer";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

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
    if (!url) return;

    try {
      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const timesRomanFont = await pdfDoc.embedFont(
        StandardFonts.TimesRomanBoldItalic
      );
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const { width, height } = firstPage.getSize();
      const fontSize = 30;
      const textWidth = fullname.length * fontSize * 0.6;
      const centeredX = width / 2 - textWidth / 2;
      const centerY = height / 2;

      firstPage.drawText(fullname, {
        x: centeredX,
        y: centerY,
        size: fontSize,
        font: timesRomanFont,
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
  }, [url, generatePdf]);

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
