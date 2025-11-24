"use client"

import React, { useCallback, useMemo } from "react"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useWorkspaceData, useWorkspaceStats, useRecentTasks } from "@/hooks/use-data-fetching"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  Plus,
  Target,
  Activity,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"

interface WorkspaceStats {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  backlogTasks: number
  totalMembers: number
  totalProjects: number
  tasksOverdue: number
}

interface RecentTask {
  id: string
  title: string
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "BACKLOG" | "BLOCKED"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  dueDate: string | null
  project?: { name: string }
}

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`bg-muted/30 rounded-md animate-pulse ${className}`} />
}

/* --- Skeleton components (full-layout) --- */
function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <SkeletonBlock className="h-8 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-72" />
      </div>
      <div className="w-24">
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </div>
    </div>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-3 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-3">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-4 w-6" />
          </div>
          <SkeletonBlock className="h-8 w-24 mb-2" />
          <SkeletonBlock className="h-3 w-40" />
        </div>
      ))}
    </div>
  )
}

function TasksSkeleton() {
  return (
    <Card>
      <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-5 w-5 rounded" />
          <SkeletonBlock className="h-5 w-32" />
        </div>
        <CardDescription>
          <SkeletonBlock className="h-3 w-40 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between items-start gap-4 p-2 rounded-lg border bg-card">
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-48 mb-1" />
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-5 w-12 rounded" />
                <SkeletonBlock className="h-5 w-12 rounded" />
                <SkeletonBlock className="h-4 w-24" />
              </div>
            </div>
            <SkeletonBlock className="h-4 w-20" />
          </div>
        ))}
        <SkeletonBlock className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  )
}

function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-36">
          <SkeletonBlock className="h-6 w-36" />
        </div>
        <CardDescription>
          <SkeletonBlock className="h-3 w-40 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 flex items-center justify-center rounded border bg-card">
            <SkeletonBlock className="h-8 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ProgressSkeleton() {
  return (
    <Card>
      <CardHeader>
        <SkeletonBlock className="h-6 w-44" />
        <CardDescription>
          <SkeletonBlock className="h-3 w-52 mt-2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonBlock className="h-4 w-full mb-3" />
        <SkeletonBlock className="h-4 w-3/4 mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="text-center">
              <SkeletonBlock className="h-8 w-14 mx-auto mb-2" />
              <SkeletonBlock className="h-3 w-20 mx-auto" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/* --- Main component --- */
function WorkspaceDashboardComp(): JSX.Element {
  const workspaceId = useWorkspaceId()
  const { user } = useKindeBrowserClient()

  const {
    workspace,
    isLoading: workspaceLoading,
    refetch: refetchWorkspace,
  } = useWorkspaceData(workspaceId)
  const { stats, isLoading: statsLoading, refetch: refetchStats } = useWorkspaceStats(workspaceId)
  const { recentTasks = [], isLoading: tasksLoading, refetch: refetchTasks } = useRecentTasks(
    workspaceId,
    5
  )

  const loading = workspaceLoading || statsLoading || tasksLoading

  const workspaceInfo = useMemo(() => {
    if (!workspace) return null
    return {
      name: workspace.name ?? "Workspace",
      imageUrl: null,
      userId: workspace.ownerId ?? "",
    }
  }, [workspace])

  const quickActions = useMemo(
    () => [
      {
        label: "Create Task",
        icon: Plus,
        href: `/workspace/${workspaceId}/tasks`,
        color: "bg-blue-500",
      },
      {
        label: "View All Tasks",
        icon: CheckSquare,
        href: `/workspace/${workspaceId}/my-tasks`,
        color: "bg-green-500",
      },
      {
        label: "Team Members",
        icon: Users,
        href: `/workspace/${workspaceId}/members`,
        color: "bg-purple-500",
      },
      {
        label: "Settings",
        icon: Target,
        href: `/workspace/${workspaceId}/settings`,
        color: "bg-orange-500",
      },
    ],
    [workspaceId]
  )

  const formatDate = useCallback((dateString: string | null) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) return "Today"
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow"
    if (date < today) return "Overdue"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }, [])

  if (loading) {
    return (
      <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6" aria-busy>
        <HeaderSkeleton />
        <StatsSkeleton />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TasksSkeleton />
          <QuickActionsSkeleton />
        </div>

        <ProgressSkeleton />
      </div>
    )
  }

  if (!stats || !workspaceInfo) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No workspace data available</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completionRate =
    stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
            Welcome back, {user?.given_name ?? "there"}!
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-2">
            Here's what's happening in <span className="font-medium">{workspaceInfo.name}</span> today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Tasks</CardTitle>
              <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground truncate">{stats.completedTasks} completed</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">In Progress</CardTitle>
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-xl sm:text-2xl font-bold">{stats.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground truncate">Currently active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Team Members</CardTitle>
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-xl sm:text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground truncate">Active collaborators</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="text-xs sm:text-sm font-medium truncate">Completion Rate</CardTitle>
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
              <div className="text-xl sm:text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground truncate">Overall progress</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Tasks */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="px-3 sm:px-6 pt-3 sm:pt-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span className="truncate">Recent Tasks</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Your latest task activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-6">
              {recentTasks.length > 0 ? (
                recentTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.06 }}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs sm:text-sm truncate">{task.title}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                        <Badge variant={task.status} className="text-xs">
                          {task.status.replace("_", " ")}
                        </Badge>
                        <Badge variant={task.priority} className="text-xs">
                          {task.priority}
                        </Badge>
                        {task.project && (
                          <span className="text-xs text-muted-foreground truncate">• {task.project.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0 self-start sm:self-auto">
                      {formatDate(task.dueDate)}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tasks yet</p>
                  <p className="text-sm text-muted-foreground">Create your first task to get started</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/workspace/${workspaceId}/my-tasks`}>View All Tasks</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <motion.div key={action.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 w-full" asChild>
                      <Link href={action.href}>
                        <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">{action.label}</span>
                      </Link>
                    </Button>
                  </motion.div>
                )
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Track your workspace progress and productivity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Task Completion</span>
                  <span>{completionRate}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ delay: 0.8, duration: 1 }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgressTasks}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.todoTasks}</div>
                  <div className="text-sm text-muted-foreground">To Do</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{stats.tasksOverdue}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default React.memo(WorkspaceDashboardComp)
