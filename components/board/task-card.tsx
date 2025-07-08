"use client"

import { useState } from "react"

interface TaskCardProps {
  task: any
  users: any[]
  currentUser: any
  onSmartAssign: () => void
  onUpdate: (task: any) => void
  onDelete: (taskId: string) => void
}

export default function TaskCard({ task, users, currentUser, onSmartAssign, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    assignedTo: task.assignedTo || "",
  })
  const [loading, setLoading] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#f56565"
      case "medium":
        return "#ed8936"
      case "low":
        return "#48bb78"
      default:
        return "#718096"
    }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editData,
          version: task.version,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onUpdate(data)
        setIsEditing(false)
      } else {
        alert(data.error || "Failed to update task")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onDelete(task.id)
      } else {
        alert("Failed to delete task")
      }
    } catch (error) {
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const assignedUser = users.find((u) => u.id === task.assignedTo)

  return (
    <div className="task-card">
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="edit-title"
            placeholder="Task title"
          />

          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="edit-description"
            placeholder="Task description"
            rows={3}
          />

          <div className="edit-row">
            <select
              value={editData.priority}
              onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
              className="edit-priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={editData.assignedTo}
              onChange={(e) => setEditData({ ...editData, assignedTo: e.target.value })}
              className="edit-assignee"
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-actions">
            <button onClick={handleSave} disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-content">
          <div className="task-header">
            <h4 className="task-title">{task.title}</h4>
            <div className="task-actions">
              <button onClick={() => setIsEditing(true)} className="action-btn edit">
                ✏️
              </button>
              <button onClick={handleDelete} className="action-btn delete">
                🗑️
              </button>
            </div>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <div className="priority-badge" style={{ backgroundColor: getPriorityColor(task.priority) }}>
              {task.priority}
            </div>

            {assignedUser && (
              <div className="assignee">
                <div className="assignee-avatar">{assignedUser.name.charAt(0).toUpperCase()}</div>
                <span className="assignee-name">{assignedUser.name}</span>
              </div>
            )}
          </div>

          <div className="task-footer">
            <button onClick={onSmartAssign} className="smart-assign-btn">
              🎯 Smart Assign
            </button>
            <div className="task-date">{new Date(task.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      )}

      <style jsx>{`
        .task-card {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          transition: all 0.2s;
          animation: cardSlideIn 0.3s ease-out;
        }

        @keyframes cardSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .task-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }

        .task-title {
          font-size: 14px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
          flex: 1;
          line-height: 1.4;
        }

        .task-actions {
          display: flex;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .task-card:hover .task-actions {
          opacity: 1;
        }

        .action-btn {
          background: none;
          border: none;
          padding: 4px;
          cursor: pointer;
          border-radius: 4px;
          font-size: 12px;
          transition: background 0.2s;
        }

        .action-btn:hover {
          background: #f7fafc;
        }

        .task-description {
          font-size: 12px;
          color: #718096;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .priority-badge {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
        }

        .assignee {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .assignee-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
        }

        .assignee-name {
          font-size: 11px;
          color: #4a5568;
          font-weight: 500;
        }

        .task-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .smart-assign-btn {
          background: #edf2f7;
          border: 1px solid #e2e8f0;
          color: #4a5568;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .smart-assign-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e0;
        }

        .task-date {
          font-size: 10px;
          color: #a0aec0;
        }

        /* Edit form styles */
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .edit-title {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .edit-title:focus {
          outline: none;
          border-color: #667eea;
        }

        .edit-description {
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 8px;
          font-size: 12px;
          resize: vertical;
          min-height: 60px;
        }

        .edit-description:focus {
          outline: none;
          border-color: #667eea;
        }

        .edit-row {
          display: flex;
          gap: 8px;
        }

        .edit-priority,
        .edit-assignee {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 6px;
          font-size: 11px;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
        }

        .save-btn {
          flex: 1;
          background: #48bb78;
          color: white;
          border: none;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .save-btn:hover:not(:disabled) {
          background: #38a169;
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-btn {
          flex: 1;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }
      `}</style>
    </div>
  )
}
