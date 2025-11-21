"use client";

import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Workspace } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { CreateWorkspaceDataType } from "./create-workspace-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteWorkspace, updateWorkspace } from "@/app/actions/workspace";
import { useConfirmation } from "@/hooks/use-delete";
import { ConfirmationDialog } from "../confirmation-dialog";
import { motion } from "framer-motion";
import { Settings2, Trash2, Save, Users, Bell, Eye, FileText } from "lucide-react";


interface DataProps extends Workspace {}

export const WorkspaceSettingsForm = ({ data }: { data: DataProps }) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  const { isOpen, confirm, handleConfirm, handleCancel, confirmationOptions } =
    useConfirmation();

  const form = useForm<CreateWorkspaceDataType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: data.name,
      description: data.description || "",
    },
  });

  const handleOnSubmit = async (values: CreateWorkspaceDataType) => {
    try {
      setIsPending(true);
      await updateWorkspace(data.id, values);
      toast.success("Workspace updated successfully.");
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
        toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Workspace",
      message:
        "Are you sure you want to delete this workspace? This action cannot be undone.",
      onConfirm: async () => {
        try {
          setIsPending(true);
          await deleteWorkspace(data.id);
          toast.success("Workspace deleted successfully.");
          router.push("/dashboard");
        } catch (error) {
          if (error instanceof Error && error.message !== "NEXT_REDIRECT") {
            toast.error(error.message || "Something went wrong.");
          }
        } finally {
          setIsPending(false);
        }
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <Settings2 className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Workspace Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your workspace details and preferences
          </p>
        </div>
      </motion.div>

      {/* Basic Information Form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Basic Information
            </CardTitle>
            <CardDescription>Update workspace name & description</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleOnSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Workspace purpose..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isPending} className="flex items-center gap-2">
                    <Save className="h-4 w-4" /> {isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>


      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="shadow-sm border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-red-600 flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </CardTitle>
            <CardDescription>All workspace data will be permanently deleted</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="destructive"
              className="w-full flex items-center gap-2 justify-center"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete Workspace
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmationDialog
        isOpen={isOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={confirmationOptions?.title || ""}
        message={confirmationOptions?.message || ""}
      />
    </div>
  );
};
