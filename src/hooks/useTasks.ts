import { useEffect, useState } from "react";
import { Student } from "../interface/student";
import { handleGetAllTasks } from "../services/task";

export default function useTasks() {
  const [tasks, setTasks] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSetTasks();
  }, []);

  const handleSetTasks = async () => {
    setIsLoading(true);
    const students = await handleGetAllTasks();
    setTasks(students);
    setIsLoading(false);
  };

  const handleUpdateTasks = (tasks: Student[]) => {
    setTasks(tasks);
  };

  return { tasks, handleUpdateTasks, isLoading };
}
