"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { projectSchema } from "@/lib/schema";
import { WorkspaceMembersProps } from "@/utils/types";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createNewProject } from "@/app/actions/project";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

interface Props {
  workspaceMembers: WorkspaceMembersProps[];
}
export type ProjectDataType = z.infer<typeof projectSchema>;

export const CreateProjectForm = ({ workspaceMembers }: Props) => {
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const form = useForm<ProjectDataType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      memberAccess: [],
      workspaceId: workspaceId as string,
    },
  });

  const handleSubmit = async (data: ProjectDataType) => {
    try {
      setPending(true);
      await createNewProject(data);
      form.reset();
      toast.success("Project created successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog>
      <TooltipProvider delayDuration={0}>
        <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger
                asChild
                onClick={() => setOpen(false)} 
              >
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="rounded-md size-6 shadow-sm hover:scale-105 transition-transform duration-200"
              >
                <Plus className="size-4" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="text-xs bg-primary text-primary-foreground rounded-md px-2 py-1 shadow-md"
          >
            Create New Project
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-lg rounded-2xl border-none p-0 overflow-hidden shadow-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
        <Card className="shadow-none border-none bg-transparent">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-xl font-semibold text-foreground  flex justify-center items-center gap-2">
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                Create a New Project
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
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  {/* Project Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80">
                          Project Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Design System, AI Agent, Uqaab 2.0"
                            {...field}
                            className="transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/60 bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Project Description */}
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
                            {...field}
                            placeholder="Briefly describe your project..."
                            className="resize-none h-24 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/60 focus:border-primary/60 bg-muted"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Member Access */}
                  <FormField
                    control={form.control}
                    name="memberAccess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                          <Users className="size-4 text-primary/70" />
                          Project Access
                        </FormLabel>
                        <FormDescription className="text-xs text-muted-foreground mb-2">
                          Select which members can access this project.
                        </FormDescription>

                        <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 bg-muted scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
                          {workspaceMembers?.length ? (
                            workspaceMembers.map((member) => (
                              <motion.div
                                key={member.userId}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-2 rounded-md hover:bg-muted px-2 py-1.5"
                              >
                                <Checkbox
                                  id={member.userId}
                                  checked={field.value?.includes(member.userId)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || [];
                                    if (checked) {
                                      field.onChange([
                                        ...currentValue,
                                        member.userId,
                                      ]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(
                                          (id) => id !== member.userId
                                        )
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={member.userId}
                                  className="text-sm text-foreground/90 capitalize cursor-pointer select-none"
                                >
                                  {member.user.name}
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({member.accessLevel.toLowerCase()})
                                  </span>
                                </label>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic text-center">
                              No members found.
                            </p>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Action Buttons */}
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
                        "Create Project"
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
