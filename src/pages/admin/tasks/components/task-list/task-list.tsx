import { Button } from "@nextui-org/button";
import { Student } from "../../../../../interface/student";
import { useState } from "react";
import { getCurrentDate } from "../../../../../utils/date";
import { handleUpdateStudent } from "../../../../../services/students";
import { toast } from "sonner";

const TaskList = ({
  tasks,
  isLoading,
  handleUpdateTasks,
}: {
  tasks: Student[];
  isLoading: boolean;
  handleUpdateTasks: (arg0: Student[]) => void;
}) => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const handleUpdate = (id: string) => {
    const updatedTasks = tasks.filter((template) => template.id !== id);
    handleUpdateTasks(updatedTasks);
  };

  const handleUpdateObservationStudent = async (
    status: "approved" | "reject",
    student: Student
  ) => {
    setIsLoadingUpdate(true);
    try {
      if (!student || !status)
        throw new Error("Necesita proporcionar un estudiante valido");
      const fullname =
        status === "approved" ? student.observation : student.fullname;
      const updateStudent = {
        ...student,
        fullname,
        status,
        updated_at: getCurrentDate(),
      };

      await handleUpdateStudent(student.id, updateStudent);
      handleUpdate(student.id);
      toast.success("Estudiante actualizado con exito");
    } catch (error) {
      console.log(error);
      toast.success(
        "Error al actualizar la observacion al estudiante: " + error
      );
      throw error;
    } finally {
      setIsLoadingUpdate(false);
    }
  };

  return (
    <article className="flex flex-col justify-center items-center h-full gap-4">
      <h3 className="font-semibold">Solicitudes de actualización de datos</h3>
      {tasks.length > 0 ? (
        <ul className="grid gap-5 grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] w-full overflow-y-auto overflow-x-hidden">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex flex-col rounded-md shadow-lg gap-3 w-[400px] p-4 border-2 border-blue-300"
            >
              <strong>
                Nombre: <p className="font-normal">{task.fullname}</p>
              </strong>
              <strong>
                Observacion: <p className="font-normal">{task.observation}</p>
              </strong>
              <strong>
                Correo: <p className="font-normal">{task.email}</p>
              </strong>
              <span className="flex gap-4 w-full justify-between items-center">
                <Button
                  color="success"
                  isDisabled={isLoadingUpdate}
                  isLoading={isLoadingUpdate}
                  onPress={() => {
                    handleUpdateObservationStudent("approved", task);
                  }}
                >
                  Confirmar
                </Button>
                <Button
                  color="danger"
                  isDisabled={isLoadingUpdate}
                  onPress={() => handleUpdateObservationStudent("reject", task)}
                >
                  Descartar
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : isLoading ? (
        <p>Cargando</p>
      ) : (
        <p>No hay tareas pendientes</p>
      )}
    </article>
  );
};

export default TaskList;
