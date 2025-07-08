"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import KanbanBoard from "@/components/board/kanban-board"
import ActivityLog from "@/components/board/activity-log"
import Header from "@/components/board/header"
import ConflictModal from "@/components/board/conflict-modal"
import { useWebSocket } from "@/hooks/use-websocket"

export default function BoardPage() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [activities, setActivities] = useState([])
  const [conflicts, setConflicts] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { socket, isConnected } = useWebSocket()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    setUser(JSON.parse(userData))
    loadInitialData()
  }, [router])

  useEffect(() => {
    if (socket) {
      socket.on("taskUpdated", (updatedTask) => {
        setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
      })

      socket.on("taskCreated", (newTask) => {
        setTasks((prev) => [...prev, newTask])
      })

      socket.on("taskDeleted", (taskId) => {
        setTasks((prev) => prev.filter((task) => task.id !== taskId))
      })

      socket.on("activityAdded", (activity) => {
        setActivities((prev) => [activity, ...prev.slice(0, 19)])
      })

      socket.on("conflictDetected", (conflict) => {
        setConflicts((prev) => [...prev, conflict])
      })

      return () => {
        socket.off("taskUpdated")
        socket.off("taskCreated")
        socket.off("taskDeleted")
        socket.off("activityAdded")
        socket.off("conflictDetected")
      }
    }
  }, [socket])

  const loadInitialData = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }

      const [tasksRes, usersRes, activitiesRes] = await Promise.all([
        fetch("/api/tasks", { headers }),
        fetch("/api/users", { headers }),
        fetch("/api/activities", { headers }),
      ])

      const [tasksData, usersData, activitiesData] = await Promise.all([
        tasksRes.json(),
        usersRes.json(),
        activitiesRes.json(),
      ])

      setTasks(tasksData)
      setUsers(usersData)
      setActivities(activitiesData)
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your board...</p>

        <style jsx>{`
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            gap: 20px;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="board-container">
      <Header user={user} onLogout={handleLogout} isConnected={isConnected} />

      <div className="board-content">
        <div className="main-board">
          <KanbanBoard tasks={tasks} users={users} currentUser={user} onTaskUpdate={setTasks} />
        </div>

        <div className="sidebar">
          <ActivityLog activities={activities} />
        </div>
      </div>

      {conflicts.map((conflict) => (
        <ConflictModal
          key={conflict.id}
          conflict={conflict}
          onResolve={(resolution) => {
            setConflicts((prev) => prev.filter((c) => c.id !== conflict.id))
            // Handle conflict resolution
          }}
        />
      ))}

      <style jsx>{`
        .board-container {
          min-height: 100vh;
          background: #f8fafc;
        }

        .board-content {
          display: flex;
          height: calc(100vh - 70px);
          gap: 20px;
          padding: 20px;
        }

        .main-board {
          flex: 1;
          min-width: 0;
        }

        .sidebar {
          width: 350px;
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .board-content {
            flex-direction: column;
            height: auto;
            min-height: calc(100vh - 70px);
          }

          .sidebar {
            width: 100%;
            order: -1;
          }
        }

        @media (max-width: 768px) {
          .board-content {
            padding: 10px;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  )
}
