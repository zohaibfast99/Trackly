"use client"

import { $Enums, TaskStatus } from "@prisma/client"
import { Column, ProjectTaskProps } from "@/utils/types"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { Separator } from "@radix-ui/react-select"
import { taskStatusVariant } from "@/utils"
import { ProjectCard } from "./project-card"
import { updatedTaskPosition } from "@/app/actions/task"
import { useWorkspaceId } from "@/hooks/use-workspace-id"
import { useProjectId } from "@/hooks/use-project-id"

const COLUMN_TITLES: Record<$Enums.TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  BACKLOG: "Backlog",
  IN_REVIEW: "In Review",
}

export const ProjectKanban = ({
  initialTasks,
}: {
  initialTasks: ProjectTaskProps[]
}) => {
  const router = useRouter()
  const workspaceId = useWorkspaceId()
  const projectId = useProjectId()

  if (!initialTasks.length) return null

  const [columns, setColumns] = useState<Column[]>([])
  const [savingTask, setSavingTask] = useState<boolean>(false) // 🔥 NEW

  const mappedColumns = useMemo(() => {
    return Object.entries(COLUMN_TITLES).map(([status, title]) => ({
      id: status as TaskStatus,
      title,
      tasks: initialTasks
        .filter((task) => task.status === status)
        .sort((a, b) => a.position - b.position),
    }))
  }, [initialTasks])

  useEffect(() => {
    setColumns(mappedColumns)
  }, [mappedColumns])

  // ====================================================
  // 🔥 Improved Drag Handler With "Saving" State
  // ====================================================
  const onDragEnd = useCallback(
    async (result: DropResult) => {
      if (savingTask) return // 🔥 Prevent dragging again while saving

      const { destination, source } = result
      if (!destination) return

      const updatedColumns = structuredClone(columns)

      const sourceCol = updatedColumns.find(
        (c) => c.id === source.droppableId
      )
      const destCol = updatedColumns.find(
        (c) => c.id === destination.droppableId
      )

      if (!sourceCol || !destCol) return

      // Remove & retrieve task
      const [movedTask] = sourceCol.tasks.splice(source.index, 1)

      // Insert into new location
      const targetTasks = destCol.tasks

      let newPosition = 0

      if (targetTasks.length === 0) {
        newPosition = 1000
      } else if (destination.index === 0) {
        newPosition = targetTasks[0].position - 1000
      } else if (destination.index === targetTasks.length) {
        newPosition = targetTasks[targetTasks.length - 1].position + 1000
      } else {
        newPosition =
          (targetTasks[destination.index - 1].position +
            targetTasks[destination.index].position) / 2
      }

      const updated = {
        ...movedTask,
        position: newPosition,
        status: destCol.id,
      }

      destCol.tasks.splice(destination.index, 0, updated)

      setColumns(updatedColumns)

      // 🔥 START SAVING STATE
      setSavingTask(true)

      try {
        // Update task in database
        const response = await updatedTaskPosition(
          movedTask.id,
          newPosition,
          destCol.id as TaskStatus,
          workspaceId,
          projectId
        )
        
        // Wait for response to confirm database update
        if (response && response.id === movedTask.id) {
          // Database update confirmed, now refresh UI
          await router.refresh()
          
          // Additional wait to ensure Next.js has revalidated and re-rendered
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
      } catch (error) {
        console.log(error)
      } finally {
        // 🔥 END SAVING STATE - only after everything is complete
        setSavingTask(false)
      }
    },
    [columns, savingTask]
  )

  return (
    <>
      {/* MAIN BOARD */}
      <div className="relative flex gap-4 h-full md:px-4 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <div
              key={column.id}
              className="flex flex-col min-w-64 lg:min-w-72 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-3"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={cn("size-3 rounded")}
                    style={{
                      backgroundColor:
                        taskStatusVariant[column.id as TaskStatus],
                    }}
                  />
                  <h2 className="font-semibold">{column.title}</h2>
                </div>
              </div>

              <Separator className="mb-2" />

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "flex-1 rounded-lg p-2 transition-colors min-h-[60px]",
                      snapshot.isDraggingOver
                        ? "bg-primary/10 dark:bg-primary/20"
                        : "bg-transparent"
                    )}
                  >
                    {column.tasks.length === 0 && (
                      <div className="text-sm text-muted-foreground italic px-2 py-6 text-center">
                        No tasks in this column
                      </div>
                    )}

                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                        isDragDisabled={savingTask} // 🔥 Disable drag during saving
                      >
                        {(provided) => (
                          <ProjectCard
                            ref={provided.innerRef}
                            provided={provided}
                            task={task}
                          />
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>

        {/* ========================================================= */}
        {/* 🔥 Floating loader while saving the drag action */}
        {/* ========================================================= */}
        {savingTask && (
          <div className="absolute bottom-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-pulse">
            <svg
              className="animate-spin h-4 w-4 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l3 3-3 3v-4a8 8 0 01-8-8z"
              />
            </svg>
            Moving task…
          </div>
        )}
      </div>
    </>
  )
}
