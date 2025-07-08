 "use client"

import { useEffect, useState } from 'react';

interface Activity {
  id?: string | number
  type: string
  userName: string
  action: string
  taskTitle?: string
  timestamp: string | Date
}

interface ActivityLogProps {
  activities?: Activity[] // Initial activities
  realTimeSource?: EventSource | WebSocket | null // Real-time event source
}

export default function ActivityLog({ activities = [], realTimeSource = null }: ActivityLogProps) {
  const [currentActivities, setCurrentActivities] = useState<Activity[]>([]);
  
  // Initialize with provided activities
  useEffect(() => {
    setCurrentActivities(Array.isArray(activities) ? activities : []);
  }, [activities]);

  // Set up real-time updates
  useEffect(() => {
    if (!realTimeSource) return;

    const handleNewActivity = (event: MessageEvent) => {
      try {
        const newActivity = JSON.parse(event.data);
        if (newActivity && typeof newActivity === 'object') {
          setCurrentActivities(prev => [
            {
              ...newActivity,
              timestamp: newActivity.timestamp || new Date(),
              id: newActivity.id || Date.now() // Generate ID if not provided
            },
            ...prev.slice(0, 49) // Keep max 50 activities
          ]);
        }
      } catch (error) {
        console.error('Error parsing activity:', error);
      }
    };

    if (realTimeSource instanceof EventSource) {
      realTimeSource.addEventListener('activity', handleNewActivity);
    } else if (realTimeSource instanceof WebSocket) {
      realTimeSource.onmessage = handleNewActivity;
    }

    return () => {
      if (realTimeSource instanceof EventSource) {
        realTimeSource.removeEventListener('activity', handleNewActivity);
      } else if (realTimeSource instanceof WebSocket) {
        realTimeSource.onmessage = null;
      }
    };
  }, [realTimeSource]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return "➕"
      case "updated":
        return "✏️"
      case "deleted":
        return "🗑️"
      case "assigned":
        return "👤"
      case "moved":
        return "↔️"
      default:
        return "📝"
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "created":
        return "#48bb78"
      case "updated":
        return "#ed8936"
      case "deleted":
        return "#f56565"
      case "assigned":
        return "#667eea"
      case "moved":
        return "#38b2ac"
      default:
        return "#718096"
    }
  }

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString()
    } catch (error) {
      return "Just now"
    }
  }

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <div className="activity-count">{currentActivities.length}</div>
      </div>

      <div className="activity-list">
        {currentActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No recent activity</p>
          </div>
        ) : (
          currentActivities.map((activity, index) => (
            <div key={activity.id || index} className="activity-item">
              <div className="activity-icon" style={{ backgroundColor: getActivityColor(activity.type) }}>
                {getActivityIcon(activity.type)}
              </div>

              <div className="activity-content">
                <div className="activity-text">
                  <strong>{activity.userName || "Unknown user"}</strong> {activity.action || "performed an action"}
                  {activity.taskTitle && <span className="task-title">"{activity.taskTitle}"</span>}
                </div>
                <div className="activity-time">{formatTimestamp(activity.timestamp)}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .activity-log {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .activity-header {
          padding: 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .activity-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .activity-count {
          background: #edf2f7;
          color: #4a5568;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .activity-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          color: #a0aec0;
        }

        .empty-icon {
          font-size: 2rem;
          margin-bottom: 12px;
        }

        .activity-item {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          animation: activitySlideIn 0.3s ease-out;
        }

        @keyframes activitySlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .activity-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          color: white;
        }

        .activity-content {
          flex: 1;
          min-width: 0;
        }

        .activity-text {
          font-size: 14px;
          color: #2d3748;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .task-title {
          color: #667eea;
          font-weight: 500;
        }

        .activity-time {
          font-size: 12px;
          color: #a0aec0;
        }

        @media (max-width: 1024px) {
          .activity-log {
            max-height: 300px;
          }
        }

        @media (max-width: 768px) {
          .activity-header,
          .activity-list {
            padding: 15px;
          }

          .activity-item {
            margin-bottom: 12px;
          }

          .activity-icon {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .activity-text {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}