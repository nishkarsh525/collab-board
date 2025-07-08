// import { type NextRequest, NextResponse } from "next/server"
// import { readData, writeData } from "@/lib/mongodb"
// import type { ITask } from "@/models/Task"
// import type { IUser } from "@/models/User"
// import { validateTask } from "@/models/Task"
// import { verifyToken } from "@/lib/auth"
// import { addActivity } from "@/lib/activity"

// const COLUMN_NAMES = ["todo", "in-progress", "done"]

// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   const user = verifyToken(request)
//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const taskId = params.id
//     const updates = await request.json()

//     const tasks = await readData<ITask>("tasks")
//     const users = await readData<IUser>("users")

//     const taskIndex = tasks.findIndex((t) => t.id === taskId)
//     if (taskIndex === -1) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 })
//     }

//     const currentTask = tasks[taskIndex]

//     // Check for version conflicts (optimistic locking)
//     if (updates.version && updates.version !== currentTask.version) {
//       return NextResponse.json(
//         {
//           error: "Conflict detected",
//           conflict: {
//             id: `conflict_${Date.now()}`,
//             taskId: taskId,
//             yourVersion: updates,
//             otherVersion: {
//               title: currentTask.title,
//               description: currentTask.description,
//               priority: currentTask.priority,
//               assignedTo: currentTask.assignedTo,
//               status: currentTask.status,
//               version: currentTask.version,
//             },
//           },
//         },
//         { status: 409 },
//       )
//     }

//     // Validate updates
//     if (updates.title !== undefined) {
//       const validationErrors = validateTask(
//         {
//           title: updates.title,
//           description: updates.description || currentTask.description,
//           priority: updates.priority || currentTask.priority,
//           assignedTo: updates.assignedTo !== undefined ? updates.assignedTo : currentTask.assignedTo,
//           createdBy: currentTask.createdBy,
//         },
//         tasks,
//         taskId,
//       )

//       if (validationErrors.length > 0) {
//         return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
//       }
//     }

//     // Determine activity type
//     let activityType = "updated"
//     let activityAction = "updated a task"

//     if (updates.status !== undefined && updates.status !== currentTask.status) {
//       activityType = "moved"
//       activityAction = `moved task to ${updates.status.replace("-", " ")}`
//     } else if (updates.assignedTo !== undefined && updates.assignedTo !== currentTask.assignedTo) {
//       activityType = "assigned"
//       activityAction = "reassigned a task"
//     }

//     // Update task
//     const updatedTask = {
//       ...currentTask,
//       ...updates,
//       updatedAt: new Date().toISOString(),
//       version: currentTask.version + 1,
//     }

//     tasks[taskIndex] = updatedTask
//     await writeData("tasks", tasks)

//     // Add activity
//     await addActivity(activityType as any, user.userId, user.name, activityAction, taskId, updatedTask.title, {
//       changes: updates,
//     })

//     // Format response
//     const assignedUser = updatedTask.assignedTo ? users.find((u) => u.id === updatedTask.assignedTo) : null
//     const createdByUser = users.find((u) => u.id === updatedTask.createdBy)

//     const formattedTask = {
//       id: updatedTask.id,
//       title: updatedTask.title,
//       description: updatedTask.description,
//       status: updatedTask.status,
//       priority: updatedTask.priority,
//       assignedTo: updatedTask.assignedTo || null,
//       assignedToName: assignedUser?.name || null,
//       createdBy: updatedTask.createdBy,
//       createdByName: createdByUser?.name || "Unknown",
//       createdAt: updatedTask.createdAt,
//       updatedAt: updatedTask.updatedAt,
//       version: updatedTask.version,
//     }

//     return NextResponse.json(formattedTask)
//   } catch (error: any) {
//     console.error("Update task error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }

// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   const user = verifyToken(request)
//   if (!user) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   try {
//     const taskId = params.id

//     const tasks = await readData<ITask>("tasks")
//     const taskIndex = tasks.findIndex((t) => t.id === taskId)

//     if (taskIndex === -1) {
//       return NextResponse.json({ error: "Task not found" }, { status: 404 })
//     }

//     const task = tasks[taskIndex]
//     tasks.splice(taskIndex, 1)
//     await writeData("tasks", tasks)

//     // Add activity
//     await addActivity("deleted", user.userId, user.name, "deleted a task", taskId, task.title)

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("Delete task error:", error)
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import { readData, writeData } from "@/lib/mongodb"
import type { ITask } from "@/models/Task"
import type { IUser } from "@/models/User"
import { validateTask } from "@/models/Task"
import { verifyToken } from "@/lib/auth"
import { addActivity } from "@/lib/activity"

const COLUMN_NAMES = ["todo", "in-progress", "done"]

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const taskId = params.id
    const updates = await request.json()

    const tasks = await readData<ITask>("tasks")
    const users = await readData<IUser>("users")

    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const currentTask = tasks[taskIndex]

    // Initialize version if not exists
    if (currentTask.version === undefined) {
      currentTask.version = 1
    }

    // Check for version conflicts (optimistic locking)
    // Only check version if it's provided in updates
    if (updates.version !== undefined && updates.version !== currentTask.version) {
      return NextResponse.json(
        {
          error: "This task was updated by another user. Please refresh and try again.",
          conflict: {
            id: `conflict_${Date.now()}`,
            taskId: taskId,
            yourVersion: updates,
            currentVersion: {
              title: currentTask.title,
              description: currentTask.description,
              priority: currentTask.priority,
              assignedTo: currentTask.assignedTo,
              status: currentTask.status,
              version: currentTask.version,
            },
          },
        },
        { status: 409 },
      )
    }

    // Check for duplicate titles in the same board (if boardId exists)
    if (updates.title !== undefined && updates.title !== currentTask.title) {
      const duplicateTask = tasks.find((t) => 
        t.title === updates.title && 
        t.id !== taskId &&
        t.boardId === currentTask.boardId // Only check if boardId exists
      )
      
      if (duplicateTask) {
        return NextResponse.json(
          { error: "A task with this title already exists" },
          { status: 409 }
        )
      }
    }

    // Validate status transitions
    if (updates.status !== undefined && updates.status !== currentTask.status) {
      if (!COLUMN_NAMES.includes(updates.status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be one of: " + COLUMN_NAMES.join(", ") },
          { status: 400 }
        )
      }

      // Check for invalid state transitions
      if (currentTask.status === "done" && updates.status === "in-progress") {
        return NextResponse.json(
          { error: "Cannot move completed task directly to in-progress. Move to todo first." },
          { status: 409 }
        )
      }
    }

    // Validate updates
    if (updates.title !== undefined) {
      const validationErrors = validateTask(
        {
          title: updates.title,
          description: updates.description || currentTask.description,
          priority: updates.priority || currentTask.priority,
          assignedTo: updates.assignedTo !== undefined ? updates.assignedTo : currentTask.assignedTo,
          createdBy: currentTask.createdBy,
        },
        tasks,
        taskId,
      )

      if (validationErrors.length > 0) {
        return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
      }
    }

    // Check if assigned user exists
    if (updates.assignedTo !== undefined && updates.assignedTo !== null) {
      const assignedUser = users.find((u) => u.id === updates.assignedTo)
      if (!assignedUser) {
        return NextResponse.json(
          { error: "Assigned user not found" },
          { status: 400 }
        )
      }
    }

    // Determine activity type
    let activityType = "updated"
    let activityAction = "updated a task"

    if (updates.status !== undefined && updates.status !== currentTask.status) {
      activityType = "moved"
      activityAction = `moved task to ${updates.status.replace("-", " ")}`
    } else if (updates.assignedTo !== undefined && updates.assignedTo !== currentTask.assignedTo) {
      activityType = "assigned"
      const assignedUser = updates.assignedTo ? users.find((u) => u.id === updates.assignedTo) : null
      activityAction = updates.assignedTo 
        ? `assigned task to ${assignedUser?.name || "Unknown user"}`
        : "unassigned task"
    }

    // Create updated task
    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: (currentTask.version || 1) + 1,
    }

    // Update task in array
    tasks[taskIndex] = updatedTask
    
    // Write data back to database
    await writeData("tasks", tasks)

    // Add activity (wrap in try-catch to not fail the whole request)
    try {
      await addActivity(
        activityType as any, 
        user.userId, 
        user.name, 
        activityAction, 
        taskId, 
        updatedTask.title, 
        {
          changes: updates,
        }
      )
    } catch (activityError) {
      console.error("Failed to add activity:", activityError)
      // Don't fail the request if activity logging fails
    }

    // Format response
    const assignedUser = updatedTask.assignedTo ? users.find((u) => u.id === updatedTask.assignedTo) : null
    const createdByUser = users.find((u) => u.id === updatedTask.createdBy)

    const formattedTask = {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      assignedTo: updatedTask.assignedTo || null,
      assignedToName: assignedUser?.name || null,
      createdBy: updatedTask.createdBy,
      createdByName: createdByUser?.name || "Unknown",
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
      version: updatedTask.version,
    }

    return NextResponse.json(formattedTask)
  } catch (error: any) {
    console.error("Update task error:", error)
    
    // Handle specific error types
    if (error.code === 11000) { // MongoDB duplicate key error
      return NextResponse.json(
        { error: "A task with this title already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const taskId = params.id

    const tasks = await readData<ITask>("tasks")
    const taskIndex = tasks.findIndex((t) => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const task = tasks[taskIndex]
    
    // Check if task can be deleted (business logic)
    if (task.status === "in-progress") {
      return NextResponse.json(
        { error: "Cannot delete task that is in progress. Please move to todo or done first." },
        { status: 409 }
      )
    }

    // Remove task from array
    tasks.splice(taskIndex, 1)
    await writeData("tasks", tasks)

    // Add activity (wrap in try-catch to not fail the whole request)
    try {
      await addActivity("deleted", user.userId, user.name, "deleted a task", taskId, task.title)
    } catch (activityError) {
      console.error("Failed to add delete activity:", activityError)
      // Don't fail the request if activity logging fails
    }

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const taskId = params.id
    const tasks = await readData<ITask>("tasks")
    const users = await readData<IUser>("users")

    const task = tasks.find((t) => t.id === taskId)
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

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
      version: task.version || 1,
    }

    return NextResponse.json(formattedTask)
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}