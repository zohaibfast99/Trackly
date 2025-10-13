"use client";

import { WorkspacesProps } from "@/utils/types";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect, useState } from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const WorkspaceSelector = ({
  workspaces,
  projectsLoading, 
}: {
  workspaces: WorkspacesProps[];
  projectsLoading: boolean;
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [selectedWorkspace, setSelectedWorkspace] = useState<
    WorkspacesProps | undefined
  >(undefined);
  const [switching, setSwitching] = useState(false); // local loader only when switching workspace

  const onWorkspaceSelect = (id: string) => {
    setSwitching(true);
    setSelectedWorkspace(
      workspaces.find((workspace) => workspace.workspaceId === id)
    );
    router.push(`/workspace/${id}`);
  };

  useEffect(() => {
    if (workspaceId && workspaces) {
      setSelectedWorkspace(
        workspaces.find((workspace) => workspace.workspaceId === workspaceId)
      );
      setSwitching(false); // stop loader once workspace is set
    }
  }, [workspaceId, workspaces]);

  // Overall loading state = either projects are loading or switching
  const loading = projectsLoading || switching;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={loading}>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border border-transparent hover:border-border hover:bg-muted/40 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {switching ? "Switching workspace..." : "Loading workspace..."}
                  </span>
                </>
              ) : (
                <>
                  <WorkspaceAvatar
                    name={
                      (selectedWorkspace?.workspace?.name as string) || "W"
                    }
                  />
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-semibold text-sm text-foreground truncate max-w-[120px]">
                      {selectedWorkspace?.workspace?.name ||
                        "Select workspace"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {workspaces.length} workspaces
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto h-4 w-4 opacity-60" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {!loading && (
            <DropdownMenuContent
              align="start"
              className="w-[--radix-dropdown-menu-trigger-width] rounded-lg shadow-lg p-1"
            >
              {workspaces.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                  No workspaces found
                </div>
              ) : (
                workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => onWorkspaceSelect(workspace.workspaceId)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-muted transition-colors",
                      workspace.workspaceId === workspaceId
                        ? "bg-muted"
                        : "bg-transparent"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <WorkspaceAvatar
                        name={workspace.workspace.name as string}
                      />
                      <p className="text-sm text-foreground capitalize truncate max-w-[140px]">
                        {workspace.workspace.name}
                      </p>
                    </div>

                    {workspace.workspaceId === workspaceId && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
