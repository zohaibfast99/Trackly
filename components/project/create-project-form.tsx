"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { projectSchema } from "@/lib/schema";
import { WorkspaceMembersProps } from "@/utils/types";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
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
import { toast } from "sonner";
import { createNewProject } from "@/app/actions/project";
import { useRouter } from "next/navigation";

interface Props {
  workspaceMembers: WorkspaceMembersProps[];
}
export type ProjectDataType = z.infer<typeof projectSchema>;

export const CreateProjectForm = ({ workspaceMembers }: Props) => {
  const workspaceId = useWorkspaceId();
  const [pending, setPending] = useState(false);
  const router = useRouter();
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
    try{
        setPending(true)

        await createNewProject(data);
        form.reset();
        toast.success("project created successfully")
        router.refresh();
    }
    catch(error){
console.log(error);
toast.error("something went wrong")
    }
    finally{
        setPending(false)
    }
    
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" className="size-5 shadow-md">
          <Plus/>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
        <Card className="shadow-none border-none">
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-lg font-semibold tracking-tight">
              Create a New Project
            </DialogTitle>
          </DialogHeader>

          <CardContent className="px-6 pb-6">
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
                      <FormLabel>Project Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter project name"
                          className="focus-visible:ring-2 focus-visible:ring-primary/50"
                          {...field}
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
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Project description..."
                          className="resize-none h-24 focus-visible:ring-2 focus-visible:ring-primary/50"
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
                      <FormLabel>Project Access</FormLabel>
                      <FormDescription className="text-xs text-muted-foreground mb-2">
                        Select which workspace members should have access to this project.
                      </FormDescription>
                      <div className="max-h-40 overflow-y-auto border rounded-lg p-3 space-y-2 bg-muted/10">
                        {workspaceMembers?.map((member) => (
                          <div
                            key={member.userId}
                            className="flex items-center gap-2"
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
                              className="text-sm capitalize cursor-pointer select-none"
                            >
                              {member.user.name}{" "}
                              <span className="text-xs text-muted-foreground">
                                ({member.accessLevel.toLowerCase()})
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex  gap-3 pt-2">
                
                  <Button
                    type="submit"
                    disabled={pending}
                    className="bg-primary text-white hover:bg-primary/90 w-full text-center"
                  >
                    {pending ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
