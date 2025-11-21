"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { taskFormSchema } from "@/lib/schema";
import { ProjectProps } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { CalendarIcon, Plus, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { createNewTask } from "@/app/actions/task";
import { cn } from "@/lib/utils";
import { taskStats } from "@/utils";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TaskPriority } from "@prisma/client";
import { FileUploadData } from "uploadthing/types";
import { FileUpload } from "../file-upload";


export type TaskFormValues = z.infer<typeof taskFormSchema>;

interface Props {
  project: ProjectProps;
}

export const CreateTaskDialog = ({ project }: Props) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false); // control dialog open state

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "TODO",
      dueDate: new Date(),
      startDate: new Date(),
      priority: "MEDIUM",
      attachments: [],
      assigneeId: "",
    },
  });

  const handleOnSubmit = async (data: TaskFormValues) => {
    try {
      setPending(true);
      await createNewTask(data, project.id, workspaceId as string);
      toast.success("Task created successfully!");
      router.refresh();
      form.reset();
      setOpen(false); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-md shadow-sm hover:scale-105 transition-transform duration-100"
        >
          Create Task
        </Button>
      </DialogTrigger>

      <DialogContent
  className="sm:max-w-lg rounded-2xl border-none p-0 overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black max-h-[90vh] overflow-y-auto"
>

        <Card className="shadow-none border-none bg-transparent">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-foreground flex justify-center items-center gap-2">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2"
              >
                <ClipboardList className="size-5 text-primary/80" />
                Create a New Task
              </motion.span>
            </DialogTitle>
          </DialogHeader>

          <CardContent className="px-6 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleOnSubmit)}
                  className="space-y-6"
                >
                  {/* Task Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Task Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Implement dashboard, fix API endpoint"
                            {...field}
                            className="transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/60 bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Assignee & Priority */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="assigneeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Assignee
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            
                            
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select assignee" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-muted">
                              {project.members.map((member) => (
                                <SelectItem
                                  key={member.id}
                                  value={member.userId}
                                >
                                  {member?.user?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium text-foreground/80">
                            Priority
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(TaskPriority).map((priority) => (
                                <SelectItem key={priority} value={priority}>
                                  {priority}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {["startDate", "dueDate"].map((dateType) => (
                      <FormField
                        key={dateType}
                        control={form.control}
                        name={dateType as "startDate" | "dueDate"}
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-sm font-medium text-foreground/80 capitalize">
                              {dateType === "startDate" ? "Start Date" : "Due Date"}
                            </FormLabel>
                            <Popover modal={true}>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal bg-muted",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Status
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taskStats.map((status) => (
                              <SelectItem
                                key={status.status}
                                value={status.status}
                              >
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add task details, goals or notes..."
                            {...field}
                            rows={4}
                            className="resize-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/60 bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="attachments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Attachments
                        </FormLabel>
                        <FormControl>
                          <FileUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={pending}
                      className="w-full font-medium transition-all duration-200 hover:scale-[1.02]"
                    >
                      {pending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Create Task"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
