"use client"

import type React from "react"

import { useState } from "react"

interface AddTaskFormProps {
  status: string
  users: any[]
  onClose: () => void
  onTaskCreated: (task: any) => void
}

export default function AddTaskForm({ status, users, onClose, onTaskCreated }: AddTaskFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.title.trim()) {
      setError("Title is required")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        onTaskCreated(data)
      } else {
        setError(data.error || "Failed to create task")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-task-form">
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          placeholder="Task title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="title-input"
          autoFocus
        />

        <textarea
          placeholder="Task description (optional)"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="description-input"
          rows={3}
        />

        <div className="form-row">
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="priority-select"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <select
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="assignee-select"
          >
            <option value="">Unassigned</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="create-btn">
            {loading ? "Creating..." : "Create Task"}
          </button>
          <button type="button" onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>

      <style jsx>{`
        .add-task-form {
          background: #f8fafc;
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
          animation: formSlideIn 0.3s ease-out;
        }

        @keyframes formSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 12px;
        }

        .title-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .title-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .description-input {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px 12px;
          font-size: 13px;
          margin-bottom: 12px;
          resize: vertical;
          min-height: 60px;
        }

        .description-input:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-row {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .priority-select,
        .assignee-select {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 12px;
        }

        .form-actions {
          display: flex;
          gap: 8px;
        }

        .create-btn {
          flex: 1;
          background: #48bb78;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }

        .create-btn:hover:not(:disabled) {
          background: #38a169;
        }

        .create-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .cancel-btn {
          flex: 1;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
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
