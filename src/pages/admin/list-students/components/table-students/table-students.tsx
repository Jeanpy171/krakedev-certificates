import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableProps,
  Selection,
} from "@nextui-org/table";
import { CertificateStudent, Student } from "../../../../../interface/student";
import { Chip } from "@nextui-org/chip";
import { Button } from "@nextui-org/button";
import { Spinner } from "@nextui-org/spinner";

const columns = [
  { name: "NOMBRES COMPLETOS", uid: "fullname" },
  { name: "CORREO", uid: "email" },
  { name: "CERTIFICACION", uid: "range" },
  { name: "OBSERVACION", uid: "observation" },
  { name: "ESTADO", uid: "status" },
];

type ExtendedColumnKey = keyof Student | "range";

interface CustomTableProps extends TableProps {
  handleOnChange: (student: Student) => void;
  data: Student[];
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export default function TableStudent({
  data,
  isLoading,
  loadMore,
  hasMore,
  handleOnChange,
  ...props
}: CustomTableProps) {
  const renderCell = React.useCallback(
    (student: Student, columnKey: ExtendedColumnKey) => {
      switch (columnKey) {
        case "email":
          return <p>{student.email}</p>;

        case "range": {
          const certificates = student?.certificates;
          return (
            <article className="flex flex-col gap-3">
              {certificates && certificates.length > 0
                ? certificates.map((certificate: CertificateStudent) => (
                    <Chip
                      color="secondary"
                      key={certificate.name + certificate.range}
                    >
                      {certificate.name} - {certificate.range}
                    </Chip>
                  ))
                : "Sin certificaciones"}
            </article>
          );
        }

        case "observation":
          return <p>{student.observation ?? "Sin modificación"}</p>;

        case "status": {
          const statusText = student.status
            ? student.status === "pending"
              ? "Pendiente"
              : student.status === "reject"
              ? "Rechazado"
              : student.status === "approved"
              ? "Aprobado"
              : "Nada que revisar"
            : "No disponible";
          return (
            <Chip
              color={
                statusText === "Pendiente"
                  ? "primary"
                  : statusText === "Rechazado"
                  ? "danger"
                  : statusText === "Aprobado"
                  ? "success"
                  : "warning"
              }
            >
              {statusText}
            </Chip>
          );
        }

        default:
          return <p>{String(student[columnKey as keyof Student])}</p>;
      }
    },
    []
  );

  return (
    <Table
      {...props}
      selectionMode="single"
      bottomContent={
        hasMore && !isLoading ? (
          <div className="flex w-full justify-center">
            <Button isDisabled={isLoading} variant="flat" onPress={loadMore}>
              {isLoading && <Spinner color="white" size="sm" />}
              Cargar más
            </Button>
          </div>
        ) : null
      }
      onSelectionChange={(e: Selection) => {
        const selectedKey = Array.from(e)[0];
        const selectedStudent = data.find((user) => user.id === selectedKey);
        if (selectedStudent) handleOnChange(selectedStudent);
      }}
      aria-label="Example table with custom cells"
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data} emptyContent="No hay estudiantes">
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => {
              if (
                typeof columnKey === "string" &&
                columns.some((col) => col.uid === columnKey)
              ) {
                return (
                  <TableCell>
                    {renderCell(item, columnKey as ExtendedColumnKey)}
                  </TableCell>
                );
              }
              return (
                <TableCell>
                  <span />
                </TableCell>
              );
            }}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
