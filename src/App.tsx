import Router from "./navigation/Router";
import Providers from "./provider/providers";

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
// import React, { useState, useEffect, useRef } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import { saveAs } from "file-saver"; // Para la descarga del PDF
// import certificate from "./certificado.pdf";

// const PdfEditor = () => {
//   const [text, setText] = useState<string>("JEAN PIERRE FUENTES MEZA"); // Texto a escribir en el PDF

//   const [pdfUrl, setPdfUrl] = useState<string | null>(null); // URL del PDF actualizado
//   const iframeRef = useRef<HTMLIFrameElement>(null); // Referencia al iframe

//   // Cargar el PDF base al inicio, pero solo una vez
//   useEffect(() => {
//     const loadPdf = async () => {
//       // Obtener el archivo PDF de la URL
//       const existingPdfBytes = await fetch(certificate).then((res) =>
//         res.arrayBuffer()
//       );

//       // Cargar el PDF en pdf-lib
//       const pdfDoc = await PDFDocument.load(existingPdfBytes);
//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       const { width, height } = firstPage.getSize();

//       // Coordenadas del centro (sin cambiar tamaño de texto)
//       const centerX = width / 2;
//       const centerY = height / 1.92; // Coordenada Y del centro

//       // Si no se han establecido coordenadas manualmente, usar el centro como predeterminado

//       // Tamaño estándar de la letra
//       const fontSize = 30; // Tamaño fijo para el texto

//       // Calcular el ancho del texto y centrarlo en el eje X
//       const textWidth = text.length * fontSize * 0.6; // Estimación del ancho del texto
//       const centeredX = centerX - textWidth / 2;

//       // Limpiar la página para no añadir múltiples textos
//       console.log("TEXTO A GRABAR: ", text);

//       // Agregar el texto en el PDF
//       firstPage.drawText(text, {
//         x: centeredX, // Centrado en X
//         y: centerY,
//         size: fontSize,
//         color: rgb(0, 0, 0),
//       });

//       // Guardar el PDF actualizado
//       const pdfBytes = await pdfDoc.save();
//       const blob = new Blob([pdfBytes], { type: "application/pdf" });
//       const newPdfUrl = URL.createObjectURL(blob);
//       setPdfUrl(newPdfUrl); // Establecer la URL del PDF actualizado
//     };

//     loadPdf();
//   }, [text]); // Se ejecuta cuando el texto o las coordenadas cambian

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setText(e.target.value);
//   };

//   const handleDownloadPdf = () => {
//     if (!pdfUrl) {
//       alert("Por favor, genera una previsualización antes de descargar.");
//       return;
//     }

//     saveAs(pdfUrl, "modified.pdf");
//   };

//   return (
//     <main className="p-6 h-screen w-full flex gap-4">
//       <section className="my-4 w-2/5">
//         <form className="space-y-4">
//           <div>
//             <label htmlFor="textInput" className="block font-semibold">
//               Texto:
//             </label>
//             <input
//               id="textInput"
//               type="text"
//               value={text}
//               onChange={handleTextChange}
//               placeholder="Escribe aquí..."
//               className="block w-full p-2 border rounded"
//             />
//           </div>

//           <div className="space-x-2">
//             <button
//               type="button"
//               onClick={handleDownloadPdf}
//               className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//             >
//               Descargar PDF
//             </button>
//           </div>
//         </form>
//       </section>

//       <section className="my-6 w-3/5 relative">
//         <h2 className="text-lg font-bold mb-2">Previsualización</h2>
//         {pdfUrl ? (
//           <>
//             <iframe
//               ref={iframeRef}
//               src={pdfUrl + '#toolbar=0&navpanes=0&scrollbar=0"'}

//               width="100%"
//               height="100%" // Cambié de 400 a 100% para que ocupe todo el alto disponible
//               title="PDF Preview"
//             />
//           </>
//         ) : (
//           <p className="text-gray-500">Cargando PDF...</p>
//         )}
//       </section>
//     </main>
//   );
// };

// export default PdfEditor;
