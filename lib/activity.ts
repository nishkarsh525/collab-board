import { readData, writeData } from "./mongodb"
import type { IActivity } from "@/models/Activity"
import { createActivity } from "@/models/Activity"

const MAX_ACTIVITIES = 100

export async function addActivity(
  type: IActivity["type"],
  userId: string,
  userName: string,
  action: string,
  taskId?: string,
  taskTitle?: string,
  metadata?: any,
): Promise<IActivity> {
  const activities = await readData<IActivity>("activities")

  const activity = createActivity(type, userId, userName, action, taskId, taskTitle, metadata)

  // Add to beginning and limit to MAX_ACTIVITIES
  activities.unshift(activity)
  if (activities.length > MAX_ACTIVITIES) {
    activities.splice(MAX_ACTIVITIES)
  }

  await writeData("activities", activities)
  return activity
}

export async function getRecentActivities(limit = 20): Promise<IActivity[]> {
  const activities = await readData<IActivity>("activities")
  return activities.slice(0, limit)
}
