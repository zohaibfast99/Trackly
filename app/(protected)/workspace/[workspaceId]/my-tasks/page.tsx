import { getMyTasks } from "@/app/data/task/get-my-tasks";
import { userRequired } from "@/app/data/user/is-user-authenticated";
import { MyTasksTable, TaskProps } from "@/app/data/project/project-table";
import { CheckSquare } from "lucide-react"; // Add Lucide icon

const MyTaskPage = async () => {
  await userRequired();

  const tasks = await getMyTasks();

  return (
    <div className="p-4">
      {/* Heading with Icon */}
      <div className="flex items-center gap-2 mb-1">
        <CheckSquare className="h-6 w-6 text-primary" />
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          My Task List
        </h1>
      </div>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-muted-foreground mb-4">
        Here are all the tasks assigned to you. Keep track of deadlines and progress!
      </p>

      {/* Task Table */}
      <MyTasksTable tasks={tasks as unknown as TaskProps[]} />
    </div>
  );
};

export default MyTaskPage;
