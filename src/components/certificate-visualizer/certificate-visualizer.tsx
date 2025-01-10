export const CertificateVisualizer = ({ url }: { url?: string }) => {
  return (
    <div className="w-full h-full object-contain">
      {url ? (
        <iframe
          //ref={iframeRef}
          src={url}
          width="100%"
          height="100%"
          title="PDF Preview"
        />
      ) : (
        <p className="text-gray-500">Cargando PDF...</p>
      )}
    </div>
  );
};
