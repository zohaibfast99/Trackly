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
      const result = await createNewWorkspace(data);

      // Check for other errors
      if (result.status && result.status !== 200) {
        toast.error(result.message || "Something went wrong. Try again later 😔");
        setPending(false);
        return;
      }
setShowDashboardPreview(true); 
      toast.success("Workspace created successfully!");
      

      // Delay for UI feedback
      router.push(`/workspace/${result.data?.id as string}`);
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
        
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black px-3 sm:px-4 py-4 sm:py-0">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm sm:max-w-lg"
        >
          <Card className="backdrop-blur-md bg-white/70 dark:bg-gray-900/60 shadow-lg border border-gray-200/50 dark:border-gray-800/50 rounded-xl sm:rounded-2xl overflow-hidden">
            <CardHeader className="text-center space-y-1 py-4 sm:py-6 px-4 sm:px-6">
              <CardTitle className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-white">
                Create New Workspace
              </CardTitle>
              <CardDescription className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                Set up a workspace for you and your team.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Workspace Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Arvo, Brick n Click, Chat App"
                            {...field}
                            disabled={pending}
                            className="h-10 sm:h-11 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 bg-gray-50 dark:bg-gray-800"
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
                        <FormLabel className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Briefly describe your workspace purpose..."
                            className="resize-none h-20 sm:h-28 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-primary/60 focus:border-primary/60 bg-gray-50 dark:bg-gray-800"
                            disabled={pending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-4 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => router.back()}
                      className="w-full sm:w-1/3 h-10 sm:h-11 text-sm sm:text-base border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all order-2 sm:order-1"
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={pending}
                      className="w-full sm:flex-1 h-10 sm:h-11 text-sm sm:text-base hover:opacity-90 transition-all font-medium order-1 sm:order-2"
                    >
                      {pending ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin" />
                          <span className="hidden sm:inline">Creating...</span>
                          <span className="sm:hidden">Creating...</span>
                        </div>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Create Workspace</span>
                          <span className="sm:hidden">Create</span>
                        </>
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
