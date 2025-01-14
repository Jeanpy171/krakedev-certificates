export const CertificateVisualizer = ({ url }: { url?: string | null }) => {
  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden">
      {url ? (
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
          title="PDF Preview"
        />
      ) : (
        <p className="text-gray-500">Aquí se visualizará la certificación</p>
      )}
    </div>
  );
};