
"use client"

import { WorkspacesProps } from "@/utils/types"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useEffect, useState } from "react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { WorkspaceAvatar } from "../workspace/workspace-avatar"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "../ui/button"

export const WorkspaceSelector = ({workspaces}:{workspaces : WorkspacesProps[]}) => {

    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [selectedWorkspace , setSelectedWorkspace] = useState<WorkspacesProps | undefined>(undefined)
    

    const onWorkspaceSelect = (id:string)=> {
        setSelectedWorkspace(
            workspaces.find((workspace)=> workspace.workspaceId === id));

            router.push(`/workspace/${id}`)

    }

    useEffect(()=>{
        if(workspaceId && workspaces){
            setSelectedWorkspace(workspaces.find((workspace)=> workspace.workspaceId === workspaceId))
        }
    }, [workspaceId,workspaces])
    return <>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">

                    <WorkspaceAvatar name= {(selectedWorkspace?.workspace?.name as string) || "W"}/>
                    <div className="font-semibold text-muted-foreground">
                        {selectedWorkspace?.workspace.name}
                    </div>
                    <ChevronsUpDown className="ml-auto"/>
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[--radix-dropdown-menu-trigger-width]">

                {
                    workspaces?.map(workspace => (
                        <DropdownMenuItem key={workspace.id} onSelect={()=> onWorkspaceSelect(workspace?.workspaceId)}>
                            <div className="flex flex-row items-center gap-2">
                                <WorkspaceAvatar
                                name = {(workspace?.workspace.name as string)}
                                />
                                <p>{workspace?.workspace.name}</p>
                            </div>

                            {workspace.workspaceId === workspaceId && (
                                <Check className="ml-auto"/>
                            )}
                        </DropdownMenuItem>
                    ))
                }

            </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
        </SidebarMenu></>
}