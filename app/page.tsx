"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setUser(JSON.parse(userData))
      router.push("/board")
    }
  }, [router])

  if (user) {
    return null // Will redirect to board
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>CollabBoard</h1>
          <p>Collaborative Task Management</p>
        </div>

        <div className="auth-tabs">
          <button className={`tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
            Login
          </button>
          <button className={`tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .auth-card {
          background: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          animation: slideUp 0.6s ease-out;
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

        .auth-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .auth-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin: 0 0 8px 0;
        }

        .auth-header p {
          color: #718096;
          margin: 0;
        }

        .auth-tabs {
          display: flex;
          margin-bottom: 30px;
          border-radius: 8px;
          background: #f7fafc;
          padding: 4px;
        }

        .tab {
          flex: 1;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: white;
          color: #667eea;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 30px 20px;
          }
          
          .auth-header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
