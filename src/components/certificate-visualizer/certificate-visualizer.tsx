export const CertificateVisualizer = ({ url }: { url?: string | null }) => {
  return (
    <div className="flex justify-center items-center w-full h-full overflow-hidden">
      {url ? (
        <iframe
          src={url}
          style={{
            width: "100%",
            height: "100%",
            // border: "none",
            // objectFit: "contain",
            // display: "block",
          }}
          title="PDF Preview"
        />
      ) : (
        <p className="text-gray-500">Aqui se visualizara la certificacion</p>
      )}
    </div>
  );
};
