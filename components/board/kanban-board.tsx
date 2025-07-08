//   // "use client"

//   // import { useState } from "react"
//   // import TaskCard from "./task-card"
//   // import AddTaskForm from "./add-task-form"
//   // import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

//   // const COLUMNS = [
//   //   { id: "todo", title: "Todo", color: "#e2e8f0" },
//   //   { id: "in-progress", title: "In Progress", color: "#fed7aa" },
//   //   { id: "done", title: "Done", color: "#bbf7d0" },
//   // ]

//   // interface KanbanBoardProps {
//   //   tasks: any[]
//   //   users: any[]
//   //   currentUser: any
//   //   onTaskUpdate: (tasks: any[]) => void
//   // }

//   // export default function KanbanBoard({ tasks, users, currentUser, onTaskUpdate }: KanbanBoardProps) {
//   //   const [showAddForm, setShowAddForm] = useState<string | null>(null)

//   //   const getTasksByStatus = (status: string) => {
//   //     return tasks.filter((task) => task.status === status)
//   //   }

//   //   const handleDragEnd = async (result: any) => {
//   //     if (!result.destination) return

//   //     const { source, destination, draggableId } = result

//   //     if (source.droppableId === destination.droppableId && source.index === destination.index) {
//   //       return
//   //     }

//   //     const task = tasks.find((t) => t.id === draggableId)
//   //     if (!task) return

//   //     const newStatus = destination.droppableId
//   //     const updatedTask = { ...task, status: newStatus }

//   //     // Optimistic update
//   //     const updatedTasks = tasks.map((t) => (t.id === draggableId ? updatedTask : t))
//   //     onTaskUpdate(updatedTasks)

//   //     // Send to server
//   //     try {
//   //       const token = localStorage.getItem("token")
//   //       await fetch(`/api/tasks/${draggableId}`, {
//   //         method: "PUT",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ status: newStatus }),
//   //       })
//   //     } catch (error) {
//   //       console.error("Failed to update task:", error)
//   //       // Revert on error
//   //       onTaskUpdate(tasks)
//   //     }
//   //   }

//   //   const handleSmartAssign = async (taskId: string) => {
//   //     // Find user with fewest active tasks
//   //     const userTaskCounts = users.map((user) => ({
//   //       user,
//   //       count: tasks.filter((task) => task.assignedTo === user.id && task.status !== "done").length,
//   //     }))

//   //     const userWithFewestTasks = userTaskCounts.reduce((min, current) => (current.count < min.count ? current : min))

//   //     const updatedTask = tasks.find((t) => t.id === taskId)
//   //     if (!updatedTask) return

//   //     updatedTask.assignedTo = userWithFewestTasks.user.id

//   //     const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
//   //     onTaskUpdate(updatedTasks)

//   //     try {
//   //       const token = localStorage.getItem("token")
//   //       await fetch(`/api/tasks/${taskId}`, {
//   //         method: "PUT",
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify({ assignedTo: userWithFewestTasks.user.id }),
//   //       })
//   //     } catch (error) {
//   //       console.error("Failed to smart assign task:", error)
//   //       onTaskUpdate(tasks)
//   //     }
//   //   }

//   //   return (
//   //     <div className="kanban-board">
//   //       <DragDropContext onDragEnd={handleDragEnd}>
//   //         <div className="columns">
//   //           {COLUMNS.map((column) => (
//   //             <div key={column.id} className="column">
//   //               <div className="column-header" style={{ backgroundColor: column.color }}>
//   //                 <h3>{column.title}</h3>
//   //                 <span className="task-count">{getTasksByStatus(column.id).length}</span>
//   //                 <button className="add-task-btn" onClick={() => setShowAddForm(column.id)}>
//   //                   +
//   //                 </button>
//   //               </div>

//   //               <Droppable droppableId={column.id}>
//   //                 {(provided, snapshot) => (
//   //                   <div
//   //                     ref={provided.innerRef}
//   //                     {...provided.droppableProps}
//   //                     className={`column-content ${snapshot.isDraggingOver ? "drag-over" : ""}`}
//   //                   >
//   //                     {showAddForm === column.id && (
//   //                       <AddTaskForm
//   //                         status={column.id}
//   //                         users={users}
//   //                         onClose={() => setShowAddForm(null)}
//   //                         onTaskCreated={(newTask) => {
//   //                           onTaskUpdate([...tasks, newTask])
//   //                           setShowAddForm(null)
//   //                         }}
//   //                       />
//   //                     )}

//   //                     {getTasksByStatus(column.id).map((task, index) => (
//   //                       <Draggable key={task.id} draggableId={task.id} index={index}>
//   //                         {(provided, snapshot) => (
//   //                           <div
//   //                             ref={provided.innerRef}
//   //                             {...provided.draggableProps}
//   //                             {...provided.dragHandleProps}
//   //                             className={snapshot.isDragging ? "dragging" : ""}
//   //                           >
//   //                             <TaskCard
//   //                               task={task}
//   //                               users={users}
//   //                               currentUser={currentUser}
//   //                               onSmartAssign={() => handleSmartAssign(task.id)}
//   //                               onUpdate={(updatedTask) => {
//   //                                 const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t))
//   //                                 onTaskUpdate(updatedTasks)
//   //                               }}
//   //                               onDelete={(taskId) => {
//   //                                 const updatedTasks = tasks.filter((t) => t.id !== taskId)
//   //                                 onTaskUpdate(updatedTasks)
//   //                               }}
//   //                             />
//   //                           </div>
//   //                         )}
//   //                       </Draggable>
//   //                     ))}
//   //                     {provided.placeholder}
//   //                   </div>
//   //                 )}
//   //               </Droppable>
//   //             </div>
//   //           ))}
//   //         </div>
//   //       </DragDropContext>

//   //       <style jsx>{`
//   //         .kanban-board {
//   //           height: 100%;
//   //           overflow: hidden;
//   //         }

//   //         .columns {
//   //           display: grid;
//   //           grid-template-columns: repeat(3, 1fr);
//   //           gap: 20px;
//   //           height: 100%;
//   //         }

//   //         .column {
//   //           background: white;
//   //           border-radius: 12px;
//   //           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   //           display: flex;
//   //           flex-direction: column;
//   //           overflow: hidden;
//   //         }

//   //         .column-header {
//   //           padding: 16px 20px;
//   //           display: flex;
//   //           align-items: center;
//   //           justify-content: space-between;
//   //           border-radius: 12px 12px 0 0;
//   //         }

//   //         .column-header h3 {
//   //           margin: 0;
//   //           font-size: 1.1rem;
//   //           font-weight: 600;
//   //           color: #2d3748;
//   //         }

//   //         .task-count {
//   //           background: rgba(255, 255, 255, 0.8);
//   //           padding: 4px 8px;
//   //           border-radius: 12px;
//   //           font-size: 12px;
//   //           font-weight: 600;
//   //           color: #4a5568;
//   //         }

//   //         .add-task-btn {
//   //           background: rgba(255, 255, 255, 0.9);
//   //           border: none;
//   //           width: 28px;
//   //           height: 28px;
//   //           border-radius: 50%;
//   //           cursor: pointer;
//   //           font-size: 18px;
//   //           font-weight: 600;
//   //           color: #4a5568;
//   //           display: flex;
//   //           align-items: center;
//   //           justify-content: center;
//   //           transition: all 0.2s;
//   //         }

//   //         .add-task-btn:hover {
//   //           background: white;
//   //           transform: scale(1.1);
//   //         }

//   //         .column-content {
//   //           flex: 1;
//   //           padding: 20px;
//   //           overflow-y: auto;
//   //           display: flex;
//   //           flex-direction: column;
//   //           gap: 12px;
//   //           min-height: 200px;
//   //         }

//   //         .column-content.drag-over {
//   //           background: #f7fafc;
//   //         }

//   //         .dragging {
//   //           transform: rotate(5deg);
//   //           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
//   //         }

//   //         @media (max-width: 1024px) {
//   //           .columns {
//   //             grid-template-columns: 1fr;
//   //             gap: 15px;
//   //           }

//   //           .column {
//   //             max-height: 400px;
//   //           }
//   //         }

//   //         @media (max-width: 768px) {
//   //           .columns {
//   //             gap: 10px;
//   //           }

//   //           .column-header {
//   //             padding: 12px 15px;
//   //           }

//   //           .column-content {
//   //             padding: 15px;
//   //           }
//   //         }
//   //       `}</style>
//   //     </div>
//   //   )
//   // }



// "use client"

// import { useState, useEffect } from "react"
// import TaskCard from "./task-card"
// import AddTaskForm from "./add-task-form"
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

// const COLUMNS = [
//   { id: "todo", title: "Todo", color: "#e2e8f0" },
//   { id: "in-progress", title: "In Progress", color: "#fed7aa" },
//   { id: "done", title: "Done", color: "#bbf7d0" },
// ]

// interface KanbanBoardProps {
//   tasks: any[]
//   users: any[]
//   currentUser: any
//   onTaskUpdate: (tasks: any[]) => void
// }

// export default function KanbanBoard({ tasks, users, currentUser, onTaskUpdate }: KanbanBoardProps) {
//   const [showAddForm, setShowAddForm] = useState<string | null>(null)
//   const [isClient, setIsClient] = useState(false)

//   // Fix hydration issue by ensuring client-side rendering
//   useEffect(() => {
//     setIsClient(true)
//   }, [])

//   const getTasksByStatus = (status: string) => {
//     // Safety check: ensure tasks is an array before filtering
//     if (!Array.isArray(tasks)) {
//       return []
//     }
//     return tasks.filter((task) => task.status === status)
//   }

//   const handleDragEnd = async (result: any) => {
//     if (!result.destination) return

//     const { source, destination, draggableId } = result

//     if (source.droppableId === destination.droppableId && source.index === destination.index) {
//       return
//     }

//     // Safety check for tasks array
//     if (!Array.isArray(tasks)) return

//     const task = tasks.find((t) => t.id === draggableId)
//     if (!task) return

//     const newStatus = destination.droppableId
//     const updatedTask = { ...task, status: newStatus }

//     // Optimistic update
//     const updatedTasks = tasks.map((t) => (t.id === draggableId ? updatedTask : t))
//     onTaskUpdate(updatedTasks)

//     // Send to server
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
//       if (!token) {
//         console.error("No token available")
//         return
//       }
      
//       await fetch(`/api/tasks/${draggableId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })
//     } catch (error) {
//       console.error("Failed to update task:", error)
//       // Revert on error
//       onTaskUpdate(tasks)
//     }
//   }

//   const handleSmartAssign = async (taskId: string) => {
//     // Safety checks
//     if (!Array.isArray(tasks) || !Array.isArray(users)) return

//     // Find user with fewest active tasks
//     const userTaskCounts = users.map((user) => ({
//       user,
//       count: tasks.filter((task) => task.assignedTo === user.id && task.status !== "done").length,
//     }))

//     const userWithFewestTasks = userTaskCounts.reduce((min, current) => (current.count < min.count ? current : min))

//     const updatedTask = tasks.find((t) => t.id === taskId)
//     if (!updatedTask) return

//     updatedTask.assignedTo = userWithFewestTasks.user.id

//     const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
//     onTaskUpdate(updatedTasks)

//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
//       if (!token) {
//         console.error("No token available")
//         return
//       }
      
//       await fetch(`/api/tasks/${taskId}`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ assignedTo: userWithFewestTasks.user.id }),
//       })
//     } catch (error) {
//       console.error("Failed to smart assign task:", error)
//       onTaskUpdate(tasks)
//     }
//   }

//   // Add loading state if tasks are not yet loaded or during hydration
//   if (!Array.isArray(tasks) || !isClient) {
//     return (
//       <div className="kanban-board">
//         <div className="loading-state">
//           <p>Loading tasks...</p>
//         </div>
//         <style jsx>{`
//           .kanban-board {
//             height: 100%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//           }
//           .loading-state {
//             text-align: center;
//             color: #718096;
//             font-size: 1.1rem;
//           }
//         `}</style>
//       </div>
//     )
//   }

//   return (
//     <div className="kanban-board">
//       <DragDropContext onDragEnd={handleDragEnd}>
//         <div className="columns">
//           {COLUMNS.map((column) => (
//             <div key={column.id} className="column">
//               <div className="column-header" style={{ backgroundColor: column.color }}>
//                 <h3>{column.title}</h3>
//                 <span className="task-count">{getTasksByStatus(column.id).length}</span>
//                 <button className="add-task-btn" onClick={() => setShowAddForm(column.id)}>
//                   +
//                 </button>
//               </div>

//               <Droppable droppableId={column.id}>
//                 {(provided, snapshot) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className={`column-content ${snapshot.isDraggingOver ? "drag-over" : ""}`}
//                   >
//                     {showAddForm === column.id && (
//                       <AddTaskForm
//                         status={column.id}
//                         users={users}
//                         onClose={() => setShowAddForm(null)}
//                         onTaskCreated={(newTask) => {
//                           onTaskUpdate([...tasks, newTask])
//                           setShowAddForm(null)
//                         }}
//                       />
//                     )}

//                     {getTasksByStatus(column.id).map((task, index) => (
//                       <Draggable key={task.id} draggableId={task.id} index={index}>
//                         {(provided, snapshot) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.draggableProps}
//                             {...provided.dragHandleProps}
//                             className={snapshot.isDragging ? "dragging" : ""}
//                           >
//                             <TaskCard
//                               task={task}
//                               users={users}
//                               currentUser={currentUser}
//                               onSmartAssign={() => handleSmartAssign(task.id)}
//                               onUpdate={(updatedTask) => {
//                                 const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t))
//                                 onTaskUpdate(updatedTasks)
//                               }}
//                               onDelete={(taskId) => {
//                                 const updatedTasks = tasks.filter((t) => t.id !== taskId)
//                                 onTaskUpdate(updatedTasks)
//                               }}
//                             />
//                           </div>
//                         )}
//                       </Draggable>
//                     ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </div>
//           ))}
//         </div>
//       </DragDropContext>

//       <style jsx>{`
//         .kanban-board {
//           height: 100%;
//           overflow: hidden;
//         }

//         .columns {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 20px;
//           height: 100%;
//         }

//         .column {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .column-header {
//           padding: 16px 20px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           border-radius: 12px 12px 0 0;
//         }

//         .column-header h3 {
//           margin: 0;
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .task-count {
//           background: rgba(255, 255, 255, 0.8);
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 600;
//           color: #4a5568;
//         }

//         .add-task-btn {
//           background: rgba(255, 255, 255, 0.9);
//           border: none;
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           cursor: pointer;
//           font-size: 18px;
//           font-weight: 600;
//           color: #4a5568;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.2s;
//         }

//         .add-task-btn:hover {
//           background: white;
//           transform: scale(1.1);
//         }

//         .column-content {
//           flex: 1;
//           padding: 20px;
//           overflow-y: auto;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//           min-height: 200px;
//         }

//         .column-content.drag-over {
//           background: #f7fafc;
//         }

//         .dragging {
//           transform: rotate(5deg);
//           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
//         }

//         @media (max-width: 1024px) {
//           .columns {
//             grid-template-columns: 1fr;
//             gap: 15px;
//           }

//           .column {
//             max-height: 400px;
//           }
//         }

//         @media (max-width: 768px) {
//           .columns {
//             gap: 10px;
//           }

//           .column-header {
//             padding: 12px 15px;
//           }

//           .column-content {
//             padding: 15px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import TaskCard from "./task-card"
import AddTaskForm from "./add-task-form"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

const COLUMNS = [
  { id: "todo", title: "Todo", color: "#e2e8f0" },
  { id: "in-progress", title: "In Progress", color: "#fed7aa" },
  { id: "done", title: "Done", color: "#bbf7d0" },
]

interface KanbanBoardProps {
  tasks: any[]
  users: any[]
  currentUser: any
  onTaskUpdate: (tasks: any[]) => void
}

export default function KanbanBoard({ tasks, users, currentUser, onTaskUpdate }: KanbanBoardProps) {
  const [showAddForm, setShowAddForm] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  const getTasksByStatus = (status: string) => {
    // Safety check: ensure tasks is an array before filtering
    if (!Array.isArray(tasks)) {
      return []
    }
    return tasks.filter((task) => task.status === status)
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Safety check for tasks array
    if (!Array.isArray(tasks)) return

    const task = tasks.find((t) => t.id === draggableId)
    if (!task) return

    const newStatus = destination.droppableId
    const updatedTask = { ...task, status: newStatus }

    // Optimistic update
    const updatedTasks = tasks.map((t) => (t.id === draggableId ? updatedTask : t))
    onTaskUpdate(updatedTasks)

    // Send to server with improved error handling
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        console.error("No authentication token available")
        return
      }
      
      const response = await fetch(`/api/tasks/${draggableId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Task updated successfully:", result)
    } catch (error) {
      console.error("Failed to update task:", error)
      // Show user-friendly error message
      alert("Failed to update task. Please try again.")
      // Revert on error
      onTaskUpdate(tasks)
    }
  }

  const handleSmartAssign = async (taskId: string) => {
    // Safety checks
    if (!Array.isArray(tasks) || !Array.isArray(users)) {
      console.error("Invalid tasks or users data")
      return
    }

    if (users.length === 0) {
      console.error("No users available for assignment")
      alert("No users available for assignment")
      return
    }

    // Find user with fewest active tasks
    const userTaskCounts = users.map((user) => ({
      user,
      count: tasks.filter((task) => task.assignedTo === user.id && task.status !== "done").length,
    }))

    const userWithFewestTasks = userTaskCounts.reduce((min, current) => (current.count < min.count ? current : min))

    const updatedTask = tasks.find((t) => t.id === taskId)
    if (!updatedTask) {
      console.error("Task not found:", taskId)
      return
    }

    updatedTask.assignedTo = userWithFewestTasks.user.id

    const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t))
    onTaskUpdate(updatedTasks)

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
      if (!token) {
        console.error("No authentication token available")
        alert("Authentication required. Please log in again.")
        return
      }
      
      console.log(`Attempting to assign task ${taskId} to user ${userWithFewestTasks.user.id}`)
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: userWithFewestTasks.user.id }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const result = await response.json()
      console.log("Task smart assigned successfully:", result)
      
      // Show success message
      alert(`Task assigned to ${userWithFewestTasks.user.name || userWithFewestTasks.user.email}`)
    } catch (error) {
      console.error("Failed to smart assign task:", error)
      
      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          alert("Network error. Please check your connection and try again.")
        } else if (error.message.includes("401")) {
          alert("Authentication failed. Please log in again.")
        } else if (error.message.includes("404")) {
          alert("Task not found. Please refresh the page.")
        } else {
          alert(`Failed to assign task: ${error.message}`)
        }
      } else {
        alert("Failed to assign task. Please try again.")
      }
      
      // Revert on error
      onTaskUpdate(tasks)
    }
  }

  // Add loading state if tasks are not yet loaded or during hydration
  if (!Array.isArray(tasks) || !isClient) {
    return (
      <div className="kanban-board">
        <div className="loading-state">
          <p>Loading tasks...</p>
        </div>
        <style jsx>{`
          .kanban-board {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-state {
            text-align: center;
            color: #718096;
            font-size: 1.1rem;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="kanban-board">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns">
          {COLUMNS.map((column) => (
            <div key={column.id} className="column">
              <div className="column-header" style={{ backgroundColor: column.color }}>
                <h3>{column.title}</h3>
                <span className="task-count">{getTasksByStatus(column.id).length}</span>
                <button className="add-task-btn" onClick={() => setShowAddForm(column.id)}>
                  +
                </button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`column-content ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                  >
                    {showAddForm === column.id && (
                      <AddTaskForm
                        status={column.id}
                        users={users}
                        onClose={() => setShowAddForm(null)}
                        onTaskCreated={(newTask) => {
                          onTaskUpdate([...tasks, newTask])
                          setShowAddForm(null)
                        }}
                      />
                    )}

                    {getTasksByStatus(column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={snapshot.isDragging ? "dragging" : ""}
                          >
                            <TaskCard
                              task={task}
                              users={users}
                              currentUser={currentUser}
                              onSmartAssign={() => handleSmartAssign(task.id)}
                              onUpdate={(updatedTask) => {
                                const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t))
                                onTaskUpdate(updatedTasks)
                              }}
                              onDelete={(taskId) => {
                                const updatedTasks = tasks.filter((t) => t.id !== taskId)
                                onTaskUpdate(updatedTasks)
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <style jsx>{`
        .kanban-board {
          height: 100%;
          overflow: hidden;
        }

        .columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          height: 100%;
        }

        .column {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .column-header {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px 12px 0 0;
        }

        .column-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .task-count {
          background: rgba(255, 255, 255, 0.8);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #4a5568;
        }

        .add-task-btn {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          font-weight: 600;
          color: #4a5568;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .add-task-btn:hover {
          background: white;
          transform: scale(1.1);
        }

        .column-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 200px;
        }

        .column-content.drag-over {
          background: #f7fafc;
        }

        .dragging {
          transform: rotate(5deg);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 1024px) {
          .columns {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .column {
            max-height: 400px;
          }
        }

        @media (max-width: 768px) {
          .columns {
            gap: 10px;
          }

          .column-header {
            padding: 12px 15px;
          }

          .column-content {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  )
}