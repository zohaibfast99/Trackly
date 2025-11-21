"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "@prisma/client";
import { ProjectProps, WorkspaceMembersProps } from "@/utils/types";

// Types for global state
interface WorkspaceData {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  ownerId: string;
  members: WorkspaceMembersProps[];
  projects: ProjectProps[];
  memberCount: number;
  lastFetched: Date;
}

interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED' | 'BACKLOG' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate?: string;
  assigneeId?: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: {
    id: string;
    name: string;
    image?: string;
  };
  project: {
    id: string;
    name: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  workspaces: string[];
}

interface AppState {
  // User data
  user: UserProfile | null;
  
  // Workspace data
  workspaces: Record<string, WorkspaceData>;
  currentWorkspaceId: string | null;
  
  // Tasks data
  tasks: Record<string, TaskData>;
  tasksByProject: Record<string, string[]>;
  myTasks: string[];
  
  // UI state
  loading: {
    workspaces: boolean;
    tasks: boolean;
    user: boolean;
  };
  
  // Cache timestamps
  cache: {
    workspaces: Record<string, Date>;
    tasks: Record<string, Date>;
    user: Date | null;
  };
}

interface AppContextType {
  state: AppState;
  
  // User actions
  setUser: (user: UserProfile) => void;
  
  // Workspace actions
  setCurrentWorkspace: (workspaceId: string) => void;
  addWorkspace: (workspace: WorkspaceData) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<WorkspaceData>) => void;
  
  // Task actions
  addTask: (task: TaskData) => void;
  updateTask: (taskId: string, updates: Partial<TaskData>) => void;
  removeTask: (taskId: string) => void;
  setTasksForProject: (projectId: string, tasks: TaskData[]) => void;
  
  // Data fetching with caching
  fetchWorkspaceData: (workspaceId: string, force?: boolean) => Promise<void>;
  fetchTasksForProject: (projectId: string, force?: boolean) => Promise<void>;
  fetchMyTasks: (force?: boolean) => Promise<void>;
  
  // Cache utilities
  clearCache: (type?: 'all' | 'workspaces' | 'tasks' | 'user') => void;
  isCacheValid: (type: string, id?: string) => boolean;
}

const initialState: AppState = {
  user: null,
  workspaces: {},
  currentWorkspaceId: null,
  tasks: {},
  tasksByProject: {},
  myTasks: [],
  loading: {
    workspaces: false,
    tasks: false,
    user: false,
  },
  cache: {
    workspaces: {},
    tasks: {},
    user: null,
  },
};

const AppContext = createContext<AppContextType | null>(null);

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Cache validation
  const isCacheValid = useCallback((type: string, id?: string) => {
    const now = new Date();
    let cacheTime: Date | null = null;

    switch (type) {
      case 'user':
        cacheTime = state.cache.user;
        break;
      case 'workspace':
        cacheTime = id ? state.cache.workspaces[id] : null;
        break;
      case 'tasks':
        cacheTime = id ? state.cache.tasks[id] : null;
        break;
    }

    if (!cacheTime) return false;
    return now.getTime() - cacheTime.getTime() < CACHE_DURATION;
  }, [state.cache]);

  // User actions
  const setUser = useCallback((user: UserProfile) => {
    setState(prev => ({
      ...prev,
      user,
      cache: {
        ...prev.cache,
        user: new Date(),
      },
    }));
  }, []);

  // Workspace actions
  const setCurrentWorkspace = useCallback((workspaceId: string) => {
    setState(prev => ({
      ...prev,
      currentWorkspaceId: workspaceId,
    }));
  }, []);

  const addWorkspace = useCallback((workspace: WorkspaceData) => {
    setState(prev => ({
      ...prev,
      workspaces: {
        ...prev.workspaces,
        [workspace.id]: workspace,
      },
      cache: {
        ...prev.cache,
        workspaces: {
          ...prev.cache.workspaces,
          [workspace.id]: new Date(),
        },
      },
    }));
  }, []);

  const updateWorkspace = useCallback((workspaceId: string, updates: Partial<WorkspaceData>) => {
    setState(prev => ({
      ...prev,
      workspaces: {
        ...prev.workspaces,
        [workspaceId]: {
          ...prev.workspaces[workspaceId],
          ...updates,
          lastFetched: new Date(),
        },
      },
    }));
  }, []);

  // Task actions
  const addTask = useCallback((task: TaskData) => {
    setState(prev => ({
      ...prev,
      tasks: {
        ...prev.tasks,
        [task.id]: task,
      },
      tasksByProject: {
        ...prev.tasksByProject,
        [task.projectId]: [
          ...(prev.tasksByProject[task.projectId] || []),
          task.id,
        ].filter((id, index, arr) => arr.indexOf(id) === index), // Remove duplicates
      },
    }));
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<TaskData>) => {
    setState(prev => {
      const existingTask = prev.tasks[taskId];
      if (!existingTask) return prev;

      const updatedTask = { ...existingTask, ...updates, updatedAt: new Date() };
      
      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: updatedTask,
        },
      };
    });
  }, []);

  const removeTask = useCallback((taskId: string) => {
    setState(prev => {
      const task = prev.tasks[taskId];
      if (!task) return prev;

      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      const newTasksByProject = { ...prev.tasksByProject };
      if (newTasksByProject[task.projectId]) {
        newTasksByProject[task.projectId] = newTasksByProject[task.projectId].filter(id => id !== taskId);
      }

      return {
        ...prev,
        tasks: newTasks,
        tasksByProject: newTasksByProject,
        myTasks: prev.myTasks.filter(id => id !== taskId),
      };
    });
  }, []);

  const setTasksForProject = useCallback((projectId: string, tasks: TaskData[]) => {
    setState(prev => {
      const newTasks = { ...prev.tasks };
      const taskIds: string[] = [];

      tasks.forEach(task => {
        newTasks[task.id] = task;
        taskIds.push(task.id);
      });

      return {
        ...prev,
        tasks: newTasks,
        tasksByProject: {
          ...prev.tasksByProject,
          [projectId]: taskIds,
        },
        cache: {
          ...prev.cache,
          tasks: {
            ...prev.cache.tasks,
            [projectId]: new Date(),
          },
        },
      };
    });
  }, []);

  // Data fetching functions (to be implemented with actual API calls)
  const fetchWorkspaceData = useCallback(async (workspaceId: string, force = false) => {
    if (!force && isCacheValid('workspace', workspaceId)) {
      return; // Use cached data
    }

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, workspaces: true },
    }));

    try {
      // Import and call the actual data fetching functions
      const { getWorkspaceInfo } = await import("@/app/actions/workspace");
      const { getWorkspaceProjectsByWorkspaceId } = await import("@/app/data/project/get-workspace-projects");

      const [workspaceResult, projectsResult] = await Promise.all([
        getWorkspaceInfo(workspaceId),
        getWorkspaceProjectsByWorkspaceId(workspaceId),
      ]);

      if (workspaceResult.success && workspaceResult.data && projectsResult) {
        const workspaceData: WorkspaceData = {
          id: workspaceId,
          name: workspaceResult.data.name,
          description: workspaceResult.data.description || undefined,
          imageUrl: undefined, // Schema doesn't have imageUrl
          ownerId: workspaceResult.data.ownerId || "",
          members: projectsResult.workspaceMembers as WorkspaceMembersProps[],
          projects: projectsResult.projects as ProjectProps[],
          memberCount: projectsResult.workspaceMembers?.length || 0,
          lastFetched: new Date(),
        };

        addWorkspace(workspaceData);
      }
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, workspaces: false },
      }));
    }
  }, [isCacheValid, addWorkspace]);

  const fetchTasksForProject = useCallback(async (projectId: string, force = false) => {
    if (!force && isCacheValid('tasks', projectId)) {
      return; // Use cached data
    }

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, tasks: true },
    }));

    try {
      const { getProjectById } = await import("@/app/data/project/get-project-di");
      const result = await getProjectById(projectId);

      if (result.tasks) {
        const formattedTasks: TaskData[] = result.tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
          assigneeId: task.assigneeId || undefined,
          projectId: task.projectId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          assignedTo: task.assignedTo ? {
            id: task.assignedTo.id,
            name: task.assignedTo.name,
            image: task.assignedTo.image || undefined,
          } : undefined,
          project: {
            id: task.project.id,
            name: task.project.name,
          },
        }));

        setTasksForProject(projectId, formattedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks for project:", error);
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, tasks: false },
      }));
    }
  }, [isCacheValid, setTasksForProject]);

  const fetchMyTasks = useCallback(async (force = false) => {
    if (!force && isCacheValid('tasks', 'my-tasks')) {
      return; // Use cached data
    }

    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, tasks: true },
    }));

    try {
      const { getMyTasks } = await import("@/app/data/task/get-my-tasks");
      const result = await getMyTasks();

      if (result && Array.isArray(result)) {
        const formattedTasks: TaskData[] = result.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
          assigneeId: task.assigneeId || undefined,
          projectId: task.projectId,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          assignedTo: task.assignedTo ? {
            id: task.assignedTo.id,
            name: task.assignedTo.name,
            image: task.assignedTo.image || undefined,
          } : undefined,
          project: {
            id: task.project.id,
            name: task.project.name,
          },
        }));

        // Add tasks to global state
        setState(prev => {
          const newTasks = { ...prev.tasks };
          const myTaskIds: string[] = [];

          formattedTasks.forEach(task => {
            newTasks[task.id] = task;
            myTaskIds.push(task.id);
          });

          return {
            ...prev,
            tasks: newTasks,
            myTasks: myTaskIds,
            cache: {
              ...prev.cache,
              tasks: {
                ...prev.cache.tasks,
                'my-tasks': new Date(),
              },
            },
          };
        });
      }
    } catch (error) {
      console.error("Error fetching my tasks:", error);
    } finally {
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, tasks: false },
      }));
    }
  }, [isCacheValid]);

  // Cache utilities
  const clearCache = useCallback((type: 'all' | 'workspaces' | 'tasks' | 'user' = 'all') => {
    setState(prev => {
      const newCache = { ...prev.cache };

      switch (type) {
        case 'workspaces':
          newCache.workspaces = {};
          break;
        case 'tasks':
          newCache.tasks = {};
          break;
        case 'user':
          newCache.user = null;
          break;
        case 'all':
          newCache.workspaces = {};
          newCache.tasks = {};
          newCache.user = null;
          break;
      }

      return {
        ...prev,
        cache: newCache,
      };
    });
  }, []);

  const contextValue: AppContextType = {
    state,
    setUser,
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    addTask,
    updateTask,
    removeTask,
    setTasksForProject,
    fetchWorkspaceData,
    fetchTasksForProject,
    fetchMyTasks,
    clearCache,
    isCacheValid,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
}

// Convenience hooks for specific data
export function useCurrentWorkspace() {
  const { state } = useAppState();
  return state.currentWorkspaceId ? state.workspaces[state.currentWorkspaceId] : null;
}

export function useWorkspaceProjects(workspaceId?: string) {
  const { state } = useAppState();
  const targetId = workspaceId || state.currentWorkspaceId;
  return targetId ? state.workspaces[targetId]?.projects || [] : [];
}

export function useProjectTasks(projectId: string) {
  const { state } = useAppState();
  const taskIds = state.tasksByProject[projectId] || [];
  return taskIds.map(id => state.tasks[id]).filter(Boolean);
}

export function useMyTasks() {
  const { state } = useAppState();
  return state.myTasks.map(id => state.tasks[id]).filter(Boolean);
}