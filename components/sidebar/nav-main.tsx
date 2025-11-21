"use client";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import {
  CheckSquare,
  LayoutDashboard,
  Settings,
  Users,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const NavMain = () => {
  const workspaceId = useWorkspaceId();
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [navigationInProgress, setNavigationInProgress] = useState(false);

  // Reset loading states when pathname changes (navigation complete)
  useEffect(() => {
    setLoadingItems({});
    setNavigationInProgress(false);
  }, [pathname]);

  const handleNavigation = async (href: string, path: string) => {
    // Prevent navigation if already on the same page or if another navigation is in progress
    if (pathname === href || navigationInProgress) return;

    setLoadingItems((prev) => ({ ...prev, [path]: true }));
    setNavigationInProgress(true);
    setOpenMobile(false);

    try {
      // Use router.push and wait for the navigation to complete
      await router.push(href);
    } catch (err) {
      console.error("Navigation error:", err);
      // Reset loading state on error
      setLoadingItems((prev) => ({ ...prev, [path]: false }));
      setNavigationInProgress(false);
    }
    // Loading will be cleared by the pathname useEffect when navigation completes
  };

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
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground mb-2">
        Menu
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-0.5 sm:space-y-1">
        {items.map((el) => {
          const isActive = pathname === el.href;
          const isLoading = loadingItems[el.path];
          const isDisabled = navigationInProgress || isLoading;

          return (
            <SidebarMenuItem key={el.label}>
              <SidebarMenuButton
                asChild
                tooltip={el.label}
                className="group relative"
              >
                <button
                  onClick={() => handleNavigation(el.href, el.path)}
                  className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 w-full relative overflow-hidden
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md pointer-events-none"
                        : isLoading
                        ? "bg-primary/20 text-primary cursor-wait hover:bg-primary/25"
                        : isDisabled
                        ? "bg-muted/30 text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                    }
                  `}

                  disabled={isDisabled}
                >
                  {/* Loading background animation */}
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <motion.div
                    className="relative z-10"
                    whileHover={!isDisabled ? { scale: 1.1 } : {}}
                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                      <el.icon
                        className={`h-4 w-4 transition-colors duration-300 ${
                          isActive
                            ? "text-primary-foreground"
                            : isLoading
                            ? "text-primary"
                            : isDisabled
                            ? "text-muted-foreground/50"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.span
                    className={`truncate relative z-10 transition-colors duration-300 ${
                      isActive
                        ? "text-primary-foreground font-semibold"
                        : isLoading
                        ? "text-primary font-medium"
                        : isDisabled
                        ? "text-muted-foreground/50"
                        : "text-muted-foreground"
                    }`}
                  >
                    {el.label}
                  </motion.span>

                  {/* Active indicator */}
                  {isActive && !isLoading && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-2 h-2 w-2 rounded-full bg-primary-foreground shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    />
                  )}

                  {/* Loading indicator */}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: [0.5, 1, 0.5],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                      className="absolute right-2 h-2 w-2 bg-primary rounded-full shadow-sm"
                    />
                  )}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};
