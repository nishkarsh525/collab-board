import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/mongodb"
import type { ITask } from "@/models/Task"
import type { IUser } from "@/models/User"
import { validateTask, createTask } from "@/models/Task"
import { verifyToken } from "@/lib/auth"
import { addActivity } from "@/lib/activity"

export async function GET(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const tasks = await readData<ITask>("tasks")
    const users = await readData<IUser>("users")

    const formattedTasks = tasks
      .map((task) => {
        const assignedUser = task.assignedTo ? users.find((u) => u.id === task.assignedTo) : null
        const createdByUser = users.find((u) => u.id === task.createdBy)

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo || null,
          assignedToName: assignedUser?.name || null,
          createdBy: task.createdBy,
          createdByName: createdByUser?.name || "Unknown",
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          version: task.version,
        }
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(formattedTasks)
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { title, description, priority, assignedTo, status } = await request.json()

    const tasks = await readData<ITask>("tasks")
    const users = await readData<IUser>("users")

    // Validation
    const validationErrors = validateTask(
      {
        title,
        description,
        priority,
        assignedTo,
        status,
        createdBy: user.userId,
      },
      tasks,
    )

    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    // Create task
    const task = createTask({
      title,
      description,
      priority,
      assignedTo,
      status,
      createdBy: user.userId,
    })

    tasks.push(task)
    await writeData("tasks", tasks)

    // Add activity
    await addActivity("created", user.userId, user.name, "created a task", task.id, task.title)

    // Format response
    const assignedUser = task.assignedTo ? users.find((u) => u.id === task.assignedTo) : null
    const createdByUser = users.find((u) => u.id === task.createdBy)

    const formattedTask = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo || null,
      assignedToName: assignedUser?.name || null,
      createdBy: task.createdBy,
      createdByName: createdByUser?.name || "Unknown",
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      version: task.version,
    }

    return NextResponse.json(formattedTask, { status: 201 })
  } catch (error: any) {
    console.error("Create task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
