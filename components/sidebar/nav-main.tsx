"use client"

import { useWorkspaceId } from "@/hooks/use-workspace-id"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar"
import { CheckSquare, LayoutDashboard, Settings, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

export const NavMain = () => {
  const workspaceId = useWorkspaceId()
  const { setOpenMobile } = useSidebar()
  const pathname = usePathname()

  const items = [
    {
      label: "Home",
      href: `/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      path: "home",
    },
    {
      label: "My Tasks",
      href: `/workspace/${workspaceId}/my-tasks`,
      icon: CheckSquare,
      path: "my-tasks",
    },
    {
      label: "Members",
      href: `/workspace/${workspaceId}/members`,
      icon: Users,
      path: "members",
    },
    {
      label: "Settings",
      href: `/workspace/${workspaceId}/settings`,
      icon: Settings,
      path: "settings",
    },
  ]

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sm font-semibold tracking-wide text-muted-foreground mb-2">
        Menu
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-1">
        {items.map((el) => {
          const isActive = pathname === el.href
          return (
            <SidebarMenuItem key={el.label}>
              <SidebarMenuButton asChild tooltip={el.label} className="group relative">
                <motion.div
                  whileHover={!isActive ? { backgroundColor: "hsl(var(--accent))" } : {}}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                    ${
                      isActive
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "text-muted-foreground"
                    }
                  `}
                  style={isActive ? { backgroundColor: "hsl(var(--primary) / 0.1)" } : {}}
                  onClick={() => setOpenMobile(false)}
                >
                  <Link href={el.href} className="flex items-center gap-3 w-full">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center"
                    >
                      <el.icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </motion.div>
                    <motion.span
                      whileHover={!isActive ? { color: "hsl(var(--foreground))" } : {}}
                    >
                      {el.label}
                    </motion.span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-2 h-2 w-2 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      />
                    )}
                  </Link>
                </motion.div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
