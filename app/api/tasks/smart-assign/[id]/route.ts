import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/mongodb"
import type { ITask } from "@/models/Task"
import type { IUser } from "@/models/User"
import { verifyToken } from "@/lib/auth"
import { addActivity } from "@/lib/activity"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const taskId = params.id

    const tasks = await readData<ITask>("tasks")
    const users = await readData<IUser>("users")

    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Calculate active tasks per user
    const userTaskCounts = users.map((user) => ({
      user,
      count: tasks.filter((task) => task.assignedTo === user.id && task.status !== "done").length,
    }))

    // Find user with fewest active tasks
    const userWithFewestTasks = userTaskCounts.reduce((min, current) => (current.count < min.count ? current : min))

    // Update task
    const updatedTask = {
      ...tasks[taskIndex],
      assignedTo: userWithFewestTasks.user.id,
      updatedAt: new Date().toISOString(),
      version: tasks[taskIndex].version + 1,
    }

    tasks[taskIndex] = updatedTask
    await writeData("tasks", tasks)

    // Add activity
    await addActivity(
      "assigned",
      user.userId,
      user.name,
      `smart assigned task to ${userWithFewestTasks.user.name}`,
      updatedTask.id,
      updatedTask.title,
    )

    // Format response
    const formattedTask = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assignedTo: updatedTask.assignedTo,
      assignedToName: userWithFewestTasks.user.name,
      createdBy: updatedTask.createdBy,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      version: updatedTask.version,
    }

    return NextResponse.json(formattedTask)
  } catch (error) {
    console.error("Smart assign error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
