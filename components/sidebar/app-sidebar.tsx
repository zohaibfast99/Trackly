import { AppSidebarDataProps } from "./app-sidebar-container";
import { ProjectProps,WorkspaceMembersProps } from "@/utils/types";
import { User } from "@prisma/client";
import { Sidebar, SidebarGroupLabel, SidebarHeader } from "../ui/sidebar";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { WorkspaceSelector } from "./workspace-selector";

export const AppSidebar = (
{data,projects,workspaceMembers,user} : {
    data:AppSidebarDataProps;
    projects: ProjectProps[];
    workspaceMembers : WorkspaceMembersProps[];
    user:User
}



)=> {
    return <>
    <Sidebar collapsible="icon">
        <SidebarHeader className="bg-background">
            <div className="flex items-center">
                <Avatar>
                    <AvatarImage src={"/icon.svg"}/>
                </Avatar>
                <SidebarGroupLabel>
                    <span className="text-xl font-bold">Trackly</span>
                </SidebarGroupLabel>
            </div>

          <div className="flex items-center justify-between mb-0">
  <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground uppercase">
    Workspace
  </SidebarGroupLabel>

  <Button asChild size="icon" className="size-5">
    <Link href="/create-workspace">
      <Plus className="w-3 h-3" />
    </Link>
  </Button>
</div>


            <WorkspaceSelector workspaces = {data.workspaces}/>
        </SidebarHeader>
    </Sidebar>
    
    </>
}