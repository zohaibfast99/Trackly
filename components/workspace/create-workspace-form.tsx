"use client";

import { workspaceSchema } from "@/lib/schema";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { createNewWorkspace } from "@/app/actions/workspace";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "../ui/card";
import {
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  Form,
  FormField,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

export type CreateWorkspaceDataType = z.infer<typeof workspaceSchema>;

export const CreateWorkspaceForm = () => {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const form = useForm<CreateWorkspaceDataType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateWorkspaceDataType) => {
    try {
      setPending(true);
      const { data: res } = await createNewWorkspace(data);
      toast.success("Workspace created successfully");
      router.push(`/workspace/${res?.id as string}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later");
    } finally {
      setPending(false);
    }
  };

   const handleCancel = () => {
    router.back(); // takes user to the previous page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md shadow-sm rounded-lg">
        <CardHeader>
          <CardTitle>Create New Workspace</CardTitle>
          <CardDescription>
            Set up a workspace for yourself and Team
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-2"
            >
              {/* Workspace Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter workspace name"
                        {...field}
                        className="focus-visible:ring-2 focus-visible:ring-primary/50"
                      />
                    </FormControl>
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
                    <FormLabel>About</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Workspace description"
                        className="resize-none h-24 focus-visible:ring-2 focus-visible:ring-primary/50"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="flex flex-row items-center gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={pending}
                  className="w-full"
                >
                  {pending ? "Creating..." : "Create Workspace"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
