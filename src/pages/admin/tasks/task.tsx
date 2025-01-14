import useTasks from "../../../hooks/useTasks";
import { Tab, Tabs } from "@nextui-org/tabs";
import TaskList from "./components/task-list/task-list";
import CreateStudent from "./components/create-student/create-student";
import { Toaster } from "sonner";

const Task = () => {
  const { isLoading, tasks, handleUpdateTasks } = useTasks();

  const TabsComponent = () => {
    return (
      <Tabs aria-label="Options">
        <Tab key="Tasks" title="Certificados">
          <TaskList
            tasks={tasks}
            isLoading={isLoading}
            handleUpdateTasks={handleUpdateTasks}
          />
        </Tab>
        <Tab key="Create new Student" title="Crear nuevo estudiante">
          <CreateStudent />
        </Tab>
      </Tabs>
    );
  };

  return (
    <main className="flex flex-col gap-3 p-2 h-full">
      <Toaster />
      {/* <section className="flex flex-col w-full h-full">
        <TabsComponent />
      </section> */}
      <TabsComponent />
    </main>
  );
};

export default Task;
