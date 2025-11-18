"use client"

import React, { useEffect, useState } from 'react'
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckSquare, 
  Clock, 
  Users, 
  TrendingUp, 
  Plus,
  Calendar,
  Target,
  Activity,
  Loader2
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { getWorkspaceStats, getRecentTasks, getWorkspaceInfo } from "@/app/actions/workspace"

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
  title: string // Changed from 'name' to 'title' to match schema
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BACKLOG' | 'BLOCKED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  dueDate: string | null
  project: {
    name: string
  } | null
}

interface WorkspaceInfo {
  name: string
  imageUrl: string | null
  userId: string
}

function WorkspaceDashboard() {
  const workspaceId = useWorkspaceId()
  const { user } = useKindeBrowserClient()
  const [stats, setStats] = useState<WorkspaceStats | null>(null)
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([])
  const [workspaceInfo, setWorkspaceInfo] = useState<WorkspaceInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      if (!workspaceId || !user) return

      try {
        setLoading(true)
        setError(null)

        // Fetch workspace info, stats, and recent tasks using server actions
        const [workspaceResult, statsResult, tasksResult] = await Promise.all([
          getWorkspaceInfo(workspaceId),
          getWorkspaceStats(workspaceId),
          getRecentTasks(workspaceId, 5)
        ])

        if (workspaceResult.success && workspaceResult.data) {
          setWorkspaceInfo({
            name: workspaceResult.data.name,
            imageUrl: null, // Schema doesn't have imageUrl field
            userId: workspaceResult.data.ownerId || ""
          })
        }

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data)
        }

        if (tasksResult.success && tasksResult.data) {
          setRecentTasks(tasksResult.data)
        }

      } catch (err) {
        console.error('Error fetching workspace data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load workspace data')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkspaceData()
  }, [workspaceId, user])

  const quickActions = [
    { 
      label: "Create Task", 
      icon: Plus, 
      href: `/workspace/${workspaceId}/tasks`, 
      color: "bg-blue-500" 
    },
    { 
      label: "View All Tasks", 
      icon: CheckSquare, 
      href: `/workspace/${workspaceId}/my-tasks`, 
      color: "bg-green-500" 
    },
    { 
      label: "Team Members", 
      icon: Users, 
      href: `/workspace/${workspaceId}/members`, 
      color: "bg-purple-500" 
    },
    { 
      label: "Settings", 
      icon: Target, 
      href: `/workspace/${workspaceId}/settings`, 
      color: "bg-orange-500" 
    }
  ]

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No due date'
    
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else if (date < today) {
      return 'Overdue'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
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

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.given_name || 'there'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening in <span className="font-medium">{workspaceInfo.name}</span> today.
          </p>
        </div>
        <Button asChild>
          <Link href={`/workspace/${workspaceId}/tasks`}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedTasks} completed
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMembers}</div>
              <p className="text-xs text-muted-foreground">
                Active collaborators
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Overall progress
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Tasks
              </CardTitle>
              <CardDescription>
                Your latest task activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTasks.length > 0 ? (
                <>
                  {recentTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={task.status} className="text-xs">
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={task.priority} className="text-xs">
                            {task.priority}
                          </Badge>
                          {task.project && (
                            <span className="text-xs text-muted-foreground">
                              • {task.project.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(task.dueDate)}
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No tasks yet</p>
                  <p className="text-sm text-muted-foreground">Create your first task to get started</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link href={`/workspace/${workspaceId}/my-tasks`}>
                  View All Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col gap-2 w-full"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium">{action.label}</span>
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>
              Track your workspace progress and productivity
            </CardDescription>
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

export default WorkspaceDashboard
