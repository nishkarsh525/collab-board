"use client"

interface ConflictModalProps {
  conflict: any
  onResolve: (resolution: "merge" | "overwrite" | "cancel") => void
}

export default function ConflictModal({ conflict, onResolve }: ConflictModalProps) {
  return (
    <div className="modal-overlay">
      <div className="conflict-modal">
        <div className="modal-header">
          <h3>⚠️ Conflict Detected</h3>
          <p>Two users edited the same task simultaneously</p>
        </div>

        <div className="conflict-content">
          <div className="version-comparison">
            <div className="version">
              <h4>Your Version</h4>
              <div className="version-details">
                <div className="field">
                  <label>Title:</label>
                  <span>{conflict.yourVersion.title}</span>
                </div>
                <div className="field">
                  <label>Description:</label>
                  <span>{conflict.yourVersion.description || "No description"}</span>
                </div>
                <div className="field">
                  <label>Priority:</label>
                  <span className={`priority ${conflict.yourVersion.priority}`}>{conflict.yourVersion.priority}</span>
                </div>
              </div>
            </div>

            <div className="version">
              <h4>Other User's Version</h4>
              <div className="version-details">
                <div className="field">
                  <label>Title:</label>
                  <span>{conflict.otherVersion.title}</span>
                </div>
                <div className="field">
                  <label>Description:</label>
                  <span>{conflict.otherVersion.description || "No description"}</span>
                </div>
                <div className="field">
                  <label>Priority:</label>
                  <span className={`priority ${conflict.otherVersion.priority}`}>{conflict.otherVersion.priority}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="conflict-actions">
            <button onClick={() => onResolve("overwrite")} className="action-btn overwrite">
              Use My Version
            </button>
            <button onClick={() => onResolve("merge")} className="action-btn merge">
              Merge Changes
            </button>
            <button onClick={() => onResolve("cancel")} className="action-btn cancel">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .conflict-modal {
          background: white;
          border-radius: 12px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }

        .modal-header h3 {
          margin: 0 0 8px 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #c53030;
        }

        .modal-header p {
          margin: 0;
          color: #718096;
        }

        .conflict-content {
          padding: 24px;
        }

        .version-comparison {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        .version {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
        }

        .version h4 {
          margin: 0 0 12px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
        }

        .version-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .field label {
          font-size: 12px;
          font-weight: 600;
          color: #4a5568;
          text-transform: uppercase;
        }

        .field span {
          font-size: 14px;
          color: #2d3748;
        }

        .priority {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          color: white;
          display: inline-block;
        }

        .priority.low {
          background: #48bb78;
        }

        .priority.medium {
          background: #ed8936;
        }

        .priority.high {
          background: #f56565;
        }

        .conflict-actions {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .action-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.overwrite {
          background: #f56565;
          color: white;
        }

        .action-btn.overwrite:hover {
          background: #e53e3e;
        }

        .action-btn.merge {
          background: #48bb78;
          color: white;
        }

        .action-btn.merge:hover {
          background: #38a169;
        }

        .action-btn.cancel {
          background: #e2e8f0;
          color: #4a5568;
        }

        .action-btn.cancel:hover {
          background: #cbd5e0;
        }

        @media (max-width: 768px) {
          .version-comparison {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .conflict-actions {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
