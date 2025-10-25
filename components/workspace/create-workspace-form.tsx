"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { workspaceSchema } from "@/lib/schema";
import { createNewWorkspace } from "@/app/actions/workspace";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "../ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { DashboardSkeleton } from "./dashboard-skeleton";

export type CreateWorkspaceDataType = z.infer<typeof workspaceSchema>;

export const CreateWorkspaceForm = () => {
  const [pending, setPending] = useState(false);
  const [showDashboardPreview, setShowDashboardPreview] = useState(false);
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

      toast.success("Workspace created successfully!");
      setShowDashboardPreview(true); 

      // Delay for UI feedback
      router.push(`/workspace/${res?.id as string}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Try again later 😔");
      setPending(false);
    }
  };

  // Hide loader once the route changes
 useEffect(() => {
    const handleRouteChange = () => setShowDashboardPreview(false);

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  return (
    <>
        {showDashboardPreview && <DashboardSkeleton />}


      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black px-4">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/60 shadow-lg border border-gray-200/50 dark:border-gray-800/50 rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-1 py-6">
              <CardTitle className="text-2xl font-semibold text-gray-800 dark:text-white">
                Create New Workspace
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                Set up a workspace for you and your team.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Workspace Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Arvo, Brick n Click, Chat App"
                            {...field}
                            disabled={pending}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 bg-gray-50 dark:bg-gray-800"
                          />
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
                        <FormLabel className="text-gray-700 dark:text-gray-300">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Briefly describe your workspace purpose..."
                            className="resize-none h-28 transition-all duration-200 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 bg-gray-50 dark:bg-gray-800"
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between pt-4 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => router.back()}
                      className="w-1/3 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={pending}
                      className="flex-1 text-base hover:opacity-90 transition-all font-medium"
                    >
                      {pending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </div>
                      ) : (
                        "Create Workspace"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};
