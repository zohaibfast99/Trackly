import { ProjectProps } from "@/utils/types";
import { File, Task, User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ProjectAvatar } from "../project/project-avatar";
import { ProfileAvatar } from "../profile-avatar";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import Image from "next/image";
import { EditTaskDialog } from "./edit-task-dialog";
import { Separator } from "../ui/separator";

interface TaskProps {
  task: Task & {
    assignedTo: User;
    project: ProjectProps;
    attachments: File[];
  };
}

export const TaskDetails = ({ task }: TaskProps) => {
  return (
    <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 bg-card">
      {/* Header */}
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3">
        <div className="space-y-2">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {task?.title}
          </CardTitle>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ProjectAvatar name={task?.project.name} />
            <span className="font-medium">{task?.project.name}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <EditTaskDialog
            key={new Date().getTime()}
            task={task}
            project={task.project}
          />

          <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-lg">
            <span className="text-xs text-muted-foreground">Assigned To:</span>
            <ProfileAvatar
              url={task.assignedTo.image || undefined}
              name={task.assignedTo.name}
            />
            <span className="text-sm font-medium">{task.assignedTo.name}</span>
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Content */}
      <CardContent className="space-y-8 mt-4">
        {/* Description */}
        <section className="space-y-2">
          <h4 className="font-medium text-sm uppercase tracking-wide text-foreground/80">
            Description
          </h4>
          <p className="text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-lg">
            {task.description || "No description provided."}
          </p>
        </section>

        {/* Additional Details */}
        <section className="space-y-3">
          <h4 className="font-medium text-sm uppercase tracking-wide text-foreground/80">
            Additional Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-muted/10 p-4 rounded-xl">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </p>
              <Badge variant={task.status} className="mt-1 px-3 py-1">
                {task.status}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Due Date
              </p>
              <p className="font-medium mt-1">
                {format(task.dueDate, "MMM d, yyyy")}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Priority
              </p>
              <Badge variant={task.priority} className="mt-1 px-3 py-1">
                {task.priority}
              </Badge>
            </div>
          </div>
        </section>

        {/* Attachments */}
        <section className="space-y-3">
          <h4 className="font-medium text-sm uppercase tracking-wide text-foreground/80">
            Attachments
          </h4>

          {task.attachments.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {task.attachments.map((file) => (
                <div
                  key={file.id}
                  className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <Image
                    src={file.type === "PDF" ? "/pdf.png" : file.url}
                    alt="attachment"
                    width={80}
                    height={120}
                    className="w-full h-44 object-cover"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted/20 p-4 rounded-lg flex items-center">
              No attachments found.
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
};
