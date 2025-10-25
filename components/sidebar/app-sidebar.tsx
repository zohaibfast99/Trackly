"use client";

import { AppSidebarDataProps } from "./app-sidebar-container";
import { ProjectProps, WorkspaceMembersProps } from "@/utils/types";
import { User } from "@prisma/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "../ui/sidebar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { WorkspaceSelector } from "./workspace-selector";
import { NavMain } from "./nav-main";
import { useState, useEffect } from "react";
import { NavProjects } from "./nav-project-list";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export const AppSidebar = ({
  data,
  projects,
  workspaceMembers,
  user,
}: {
  data: AppSidebarDataProps;
  projects: ProjectProps[];
  workspaceMembers: WorkspaceMembersProps[];
  user: User;
}) => {
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (projects) setProjectsLoading(false);
  }, [projects]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background px-3 py-2 border-b">
        {/* Logo & App Name */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="size-6">
            <AvatarImage src="/icon.svg" alt="Trackly Icon" />
          </Avatar>
          <span className="text-lg font-bold tracking-tight">Trackly</span>
        </div>

        {/* Workspace Header */}
        <div className="flex items-center justify-between">
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground uppercase">
            Workspace
          </SidebarGroupLabel>

          <TooltipProvider delayDuration={0}>
            <Tooltip open={open} onOpenChange={setOpen}>
              <TooltipTrigger
                asChild
                onClick={() => setOpen(false)} 
              >
                <Button
                  size="icon"
                  className="rounded-md size-6 shadow-sm hover:scale-105 transition-transform duration-200"
                >
                  <Link href="/create-workspace">
                    <Plus className="w-4 h-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="text-xs bg-primary text-primary-foreground rounded-md px-2 py-1 shadow-md"
              >
                Create New Workspace
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="mt-0">
          <WorkspaceSelector
            workspaces={data.workspaces.map((workspace) => ({
              ...workspace,
              AccessLevel: workspace.accessLevel,
            }))}
            projectsLoading={projectsLoading}
          />
        </div>
      </SidebarHeader>

      {/* Sidebar Navigation */}
      <SidebarContent className="pt-2">
        <NavMain />

        {projectsLoading ? (
          <div className="px-4 py-3 text-sm text-muted-foreground animate-pulse">
            Loading projects...
          </div>
        ) : (
          <NavProjects
            projects={projects}
            workspaceMembers={workspaceMembers}
          />
        )}
      </SidebarContent>
    </Sidebar>
  );
};
