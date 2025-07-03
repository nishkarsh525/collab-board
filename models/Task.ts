export interface ITask {
  boardId: any
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "done"
  priority: "low" | "medium" | "high"
  assignedTo: string | null
  createdBy: string
  createdAt: string
  updatedAt: string
  version: number
}

const COLUMN_NAMES = ["todo", "in-progress", "done"]

export function validateTask(taskData: Partial<ITask>, existingTasks: ITask[], excludeId?: string): string[] {
  const errors: string[] = []

  if (!taskData.title || taskData.title.trim().length === 0) {
    errors.push("Title is required")
  }

  if (taskData.title) {
    const titleLower = taskData.title.toLowerCase().trim()

    // Check if title matches column names
    if (COLUMN_NAMES.includes(titleLower)) {
      errors.push("Task title cannot match column names (Todo, In Progress, Done)")
    }

    // Check if title is unique
    const existingTask = existingTasks.find((t) => t.id !== excludeId && t.title.toLowerCase().trim() === titleLower)
    if (existingTask) {
      errors.push("Task title must be unique")
    }
  }

  if (taskData.status && !["todo", "in-progress", "done"].includes(taskData.status)) {
    errors.push("Invalid status")
  }

  if (taskData.priority && !["low", "medium", "high"].includes(taskData.priority)) {
    errors.push("Invalid priority")
  }

  return errors
}

export function createTask(taskData: Omit<ITask, "id" | "createdAt" | "updatedAt" | "version">): ITask {
  const now = new Date().toISOString()

  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: taskData.title.trim(),
    description: taskData.description?.trim() || "",
    status: taskData.status || "todo",
    priority: taskData.priority || "medium",
    assignedTo: taskData.assignedTo || null,
    createdBy: taskData.createdBy,
    createdAt: now,
    updatedAt: now,
    version: 1,
  }
}
