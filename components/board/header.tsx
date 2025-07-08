"use client"

interface HeaderProps {
  user: any
  onLogout: () => void
  isConnected: boolean
}

export default function Header({ user, onLogout, isConnected }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>CollabBoard</h1>
          <div className="connection-status">
            <div className={`status-dot ${isConnected ? "connected" : "disconnected"}`}></div>
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
            <span className="user-name">{user.name}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <style jsx>{`
        .header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          height: 70px;
          display: flex;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 20px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #718096;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-dot.connected {
          background: #48bb78;
        }

        .status-dot.disconnected {
          background: #f56565;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
          color: #2d3748;
        }

        .logout-btn {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .logout-btn:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 15px;
          }

          .header-left h1 {
            font-size: 1.25rem;
          }

          .connection-status {
            display: none;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}
