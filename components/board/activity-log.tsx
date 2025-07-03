// "use client"

// interface ActivityLogProps {
//   activities: any[]
// }

// export default function ActivityLog({ activities }: ActivityLogProps) {
//   const getActivityIcon = (type: string) => {
//     switch (type) {
//       case "created":
//         return "➕"
//       case "updated":
//         return "✏️"
//       case "deleted":
//         return "🗑️"
//       case "assigned":
//         return "👤"
//       case "moved":
//         return "↔️"
//       default:
//         return "📝"
//     }
//   }

//   const getActivityColor = (type: string) => {
//     switch (type) {
//       case "created":
//         return "#48bb78"
//       case "updated":
//         return "#ed8936"
//       case "deleted":
//         return "#f56565"
//       case "assigned":
//         return "#667eea"
//       case "moved":
//         return "#38b2ac"
//       default:
//         return "#718096"
//     }
//   }

//   return (
//     <div className="activity-log">
//       <div className="activity-header">
//         <h3>Recent Activity</h3>
//         <div className="activity-count">{activities.length}</div>
//       </div>

//       <div className="activity-list">
//         {activities.length === 0 ? (
//           <div className="empty-state">
//             <div className="empty-icon">📋</div>
//             <p>No recent activity</p>
//           </div>
//         ) : (
//           activities.map((activity, index) => (
//             <div key={activity.id || index} className="activity-item">
//               <div className="activity-icon" style={{ backgroundColor: getActivityColor(activity.type) }}>
//                 {getActivityIcon(activity.type)}
//               </div>

//               <div className="activity-content">
//                 <div className="activity-text">
//                   <strong>{activity.userName}</strong> {activity.action}
//                   {activity.taskTitle && <span className="task-title">"{activity.taskTitle}"</span>}
//                 </div>
//                 <div className="activity-time">{new Date(activity.timestamp).toLocaleTimeString()}</div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       <style jsx>{`
//         .activity-log {
//           background: white;
//           border-radius: 12px;
//           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//           height: 100%;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//         }

//         .activity-header {
//           padding: 20px;
//           border-bottom: 1px solid #e2e8f0;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//         }

//         .activity-header h3 {
//           margin: 0;
//           font-size: 1.1rem;
//           font-weight: 600;
//           color: #2d3748;
//         }

//         .activity-count {
//           background: #edf2f7;
//           color: #4a5568;
//           padding: 4px 8px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 600;
//         }

//         .activity-list {
//           flex: 1;
//           overflow-y: auto;
//           padding: 20px;
//         }

//         .empty-state {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 200px;
//           color: #a0aec0;
//         }

//         .empty-icon {
//           font-size: 2rem;
//           margin-bottom: 12px;
//         }

//         .activity-item {
//           display: flex;
//           gap: 12px;
//           margin-bottom: 16px;
//           animation: activitySlideIn 0.3s ease-out;
//         }

//         @keyframes activitySlideIn {
//           from {
//             opacity: 0;
//             transform: translateX(-20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateX(0);
//           }
//         }

//         .activity-icon {
//           width: 32px;
//           height: 32px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 14px;
//           flex-shrink: 0;
//           color: white;
//         }

//         .activity-content {
//           flex: 1;
//           min-width: 0;
//         }

//         .activity-text {
//           font-size: 14px;
//           color: #2d3748;
//           line-height: 1.4;
//           margin-bottom: 4px;
//         }

//         .task-title {
//           color: #667eea;
//           font-weight: 500;
//         }

//         .activity-time {
//           font-size: 12px;
//           color: #a0aec0;
//         }

//         @media (max-width: 1024px) {
//           .activity-log {
//             max-height: 300px;
//           }
//         }

//         @media (max-width: 768px) {
//           .activity-header,
//           .activity-list {
//             padding: 15px;
//           }

//           .activity-item {
//             margin-bottom: 12px;
//           }

//           .activity-icon {
//             width: 28px;
//             height: 28px;
//             font-size: 12px;
//           }

//           .activity-text {
//             font-size: 13px;
//           }
//         }
//       `}</style>
//     </div>
//   )
// }



"use client"

interface Activity {
  id?: string | number
  type: string
  userName: string
  action: string
  taskTitle?: string
  timestamp: string | Date
}

interface ActivityLogProps {
  activities?: Activity[] // Made optional with proper typing
}

export default function ActivityLog({ activities = [] }: ActivityLogProps) {
  // Ensure activities is always an array
  const safeActivities = Array.isArray(activities) ? activities : []

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
      return "Invalid time"
    }
  }

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <div className="activity-count">{safeActivities.length}</div>
      </div>

      <div className="activity-list">
        {safeActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>No recent activity</p>
          </div>
        ) : (
          safeActivities.map((activity, index) => (
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