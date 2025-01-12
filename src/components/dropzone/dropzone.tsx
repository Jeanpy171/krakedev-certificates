import { ReactNode, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdClose, IoMdCloudUpload } from "react-icons/io";

interface DropzoneProps {
  children?: ReactNode;
  className?: string;
  accept: AcceptTypes;
  onDroppingText: string;
  onHoverText: string;
  multiple?: boolean;
  file?: { path: string | null; file?: File | null } | string | null;
  handleRemoveSelectedFile: () => void;
  handleReaderFiles: (arg0: File[]) => void;
  setFiles?: (arg0: File[]) => void;
  disabled?: boolean;
}

interface AcceptTypes {
  [key: string]: string[];
}

export default function Dropzone({
  children,
  className,
  accept,
  onDroppingText,
  onHoverText,
  handleRemoveSelectedFile,
  file,
  handleReaderFiles,
  //setFiles,
  multiple = false,
  disabled = false,
}: DropzoneProps) {
    console.warn("ESTO ESTA EN FILE: ", file)
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleReaderFiles(acceptedFiles);
    },
    [handleReaderFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept,
    multiple,
    onDrop,
  });

  const getHeightClass = (accept: AcceptTypes) => {
    if (accept.video) {
      return "h-3/6";
    } else if (accept["image/jpeg"] || accept["image/png"]) {
      return "h-full";
    }
    return "h-full";
  };

  return (
    <div
      className={`${className} ${
        disabled ? "opacity-40" : ""
      } cursor-pointer relative`}
      {...getRootProps()}
    >
      {file ? (
        <div className="relative w-full h-full flex justify-center items-center">
          {children}
          <button
            title="b"
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveSelectedFile();
            }}
            className="absolute top-2 right-2 z-50 bg-red-400 rounded-sm"
          >
            <IoMdClose size={20} color="white" />
          </button>
          <div
            className={`absolute inset-0 w-full ${getHeightClass(
              accept
            )} flex z-30 justify-center items-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 `}
          >
            <input {...getInputProps()} />
            <p className="text-white text-xs md:text-sm text-center">
              {onDroppingText}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-2 p-3 w-full h-full">
          <input {...getInputProps()} />
          <h4 className="text-xs md:text-sm">{onHoverText}</h4>
          <IoMdCloudUpload size={30} />
        </div>
      )}
    </div>
  );
}
