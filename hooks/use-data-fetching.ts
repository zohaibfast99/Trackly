"use client";

import { useEffect, useState } from "react";
import { useAppState } from "@/contexts/app-state-context";

// Hook for workspace data with automatic caching and loading states
export function useWorkspaceData(workspaceId: string) {
  const { state, fetchWorkspaceData } = useAppState();
  const [isInitializing, setIsInitializing] = useState(true);

  const workspace = state.workspaces[workspaceId];
  const isLoading = state.loading.workspaces;
  const isError = !workspace && !isLoading && !isInitializing;

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceData(workspaceId)
        .finally(() => setIsInitializing(false));
    }
  }, [workspaceId, fetchWorkspaceData]);

  return {
    workspace,
    isLoading: isLoading || isInitializing,
    isError,
    refetch: () => fetchWorkspaceData(workspaceId, true),
  };
}

// Hook for project tasks with caching
export function useProjectTasksData(projectId: string) {
  const { state, fetchTasksForProject } = useAppState();
  const [isInitializing, setIsInitializing] = useState(true);

  const taskIds = state.tasksByProject[projectId] || [];
  const tasks = taskIds.map(id => state.tasks[id]).filter(Boolean);
  const isLoading = state.loading.tasks;
  const isError = taskIds.length === 0 && !isLoading && !isInitializing;

  useEffect(() => {
    if (projectId) {
      fetchTasksForProject(projectId)
        .finally(() => setIsInitializing(false));
    }
  }, [projectId, fetchTasksForProject]);

  return {
    tasks,
    isLoading: isLoading || isInitializing,
    isError,
    refetch: () => fetchTasksForProject(projectId, true),
  };
}

// Hook for user's assigned tasks
export function useMyTasksData() {
  const { state, fetchMyTasks } = useAppState();
  const [isInitializing, setIsInitializing] = useState(true);

  const tasks = state.myTasks.map(id => state.tasks[id]).filter(Boolean);
  const isLoading = state.loading.tasks;

  useEffect(() => {
    fetchMyTasks()
      .finally(() => setIsInitializing(false));
  }, [fetchMyTasks]);

  return {
    tasks,
    isLoading: isLoading || isInitializing,
    refetch: () => fetchMyTasks(true),
  };
}

// Hook for workspace statistics with caching
export function useWorkspaceStats(workspaceId: string) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  // Cache duration: 2 minutes for stats
  const STATS_CACHE_DURATION = 2 * 60 * 1000;

  const isCacheValid = lastFetch && 
    (new Date().getTime() - lastFetch.getTime()) < STATS_CACHE_DURATION;

  const fetchStats = async (force = false) => {
    if (!force && isCacheValid) return;

    setIsLoading(true);
    try {
      const { getWorkspaceStats } = await import("@/app/actions/workspace");
      const result = await getWorkspaceStats(workspaceId);
      
      if (result.success) {
        setStats(result.data);
        setLastFetch(new Date());
      }
    } catch (error) {
      console.error("Error fetching workspace stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId && !isCacheValid) {
      fetchStats();
    }
  }, [workspaceId]);

  return {
    stats,
    isLoading,
    refetch: () => fetchStats(true),
    isCacheValid: !!isCacheValid,
  };
}

// Hook for recent tasks with caching
export function useRecentTasks(workspaceId: string, limit = 5) {
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);

  const RECENT_TASKS_CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

  const isCacheValid = lastFetch && 
    (new Date().getTime() - lastFetch.getTime()) < RECENT_TASKS_CACHE_DURATION;

  const fetchRecentTasks = async (force = false) => {
    if (!force && isCacheValid) return;

    setIsLoading(true);
    try {
      const { getRecentTasks } = await import("@/app/actions/workspace");
      const result = await getRecentTasks(workspaceId, limit);
      
      if (result.success && result.data) {
        // Format tasks for consistency
        const formattedTasks = result.data.map(task => ({
          id: task.id,
          title: task.title,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.toISOString() : null,
          project: {
            name: task.project.name
          }
        }));
        setRecentTasks(formattedTasks);
        setLastFetch(new Date());
      }
    } catch (error) {
      console.error("Error fetching recent tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (workspaceId && !isCacheValid) {
      fetchRecentTasks();
    }
  }, [workspaceId]);

  return {
    recentTasks,
    isLoading,
    refetch: () => fetchRecentTasks(true),
    isCacheValid: !!isCacheValid,
  };
}

// Hook for optimized data prefetching
export function usePrefetch() {
  const { fetchWorkspaceData, fetchTasksForProject } = useAppState();

  const prefetchWorkspace = (workspaceId: string) => {
    // Prefetch in background without showing loading state
    fetchWorkspaceData(workspaceId).catch(console.error);
  };

  const prefetchProjectTasks = (projectId: string) => {
    fetchTasksForProject(projectId).catch(console.error);
  };

  return {
    prefetchWorkspace,
    prefetchProjectTasks,
  };
}