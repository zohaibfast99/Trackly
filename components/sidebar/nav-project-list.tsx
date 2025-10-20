"use client"

import { ProjectProps, WorkspaceMembersProps } from "@/utils/types"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Folder } from "lucide-react"
import { CreateProjectForm } from "../project/create-project-form"
import { useTransition } from "react"

export const NavProjects = ({
  projects,
  workspaceMembers,
}: {
  projects: ProjectProps[]
  workspaceMembers: WorkspaceMembersProps[]
}) => {
  const { isMobile, setOpenMobile } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleProjectClick = (href: string, isActive: boolean) => {
    if (isActive) return // prevent click on active project
    setOpenMobile(false)
    startTransition(() => router.push(href))
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {/* Header Section */}
      <SidebarGroupLabel className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          Projects
        </span>
        <div className="flex items-center gap-2">
          <CreateProjectForm workspaceMembers={workspaceMembers} />
        </div>
      </SidebarGroupLabel>

      {/* Projects Menu */}
      <SidebarMenu className="space-y-1">
        {projects?.length > 0 ? (
          projects.map((proj) => {
            const href = `/workspace/${proj.workspaceId}/projects/${proj.id}`
            const isActive = pathname === href

            return (
              <SidebarMenuItem key={proj.id}>
                <SidebarMenuButton asChild>
                  <motion.button
                    onClick={() => handleProjectClick(href, isActive)}
                    disabled={isPending}
                    whileHover={!isActive ? { backgroundColor: "hsl(var(--accent))" } : {}}
                    className={`relative flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm transition-all duration-200 overflow-hidden group
                      ${
                        isActive
                          ? "bg-primary/10 text-primary dark:bg-primary/20 font-semibold cursor-default"
                          : "text-muted-foreground cursor-pointer"
                      }
                    `}
                    style={isActive ? { backgroundColor: "hsl(var(--primary) / 0.1)" } : {}}
                  >
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="flex items-center"
                    >
                      <Folder
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>

                    {/* Project name */}
                    <motion.span 
                      className="truncate max-w-[130px]"
                      whileHover={!isActive ? { color: "hsl(var(--foreground))" } : {}}
                    >
                      {proj.name}
                    </motion.span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="projectIndicator"
                        className="absolute right-3 h-2 w-2 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </motion.button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })
        ) : (
          <p className="text-xs text-muted-foreground px-3 py-2 italic">
            No projects yet
          </p>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
