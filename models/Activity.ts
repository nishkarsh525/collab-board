export interface IActivity {
  id: string
  type: "created" | "updated" | "deleted" | "assigned" | "moved"
  userId: string
  userName: string
  action: string
  taskId?: string
  taskTitle?: string
  timestamp: string
  metadata?: any
}

export function createActivity(
  type: IActivity["type"],
  userId: string,
  userName: string,
  action: string,
  taskId?: string,
  taskTitle?: string,
  metadata?: any,
): IActivity {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    userId,
    userName,
    action,
    taskId,
    taskTitle,
    timestamp: new Date().toISOString(),
    metadata,
  }
}
