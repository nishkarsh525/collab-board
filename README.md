# 📘 CollabBook – Real-Time Collaborative Task Board

CollabBook is a **web-based collaborative Kanban board** that allows multiple users to manage tasks in real time. Inspired by tools like Trello, it supports live task updates, smart assignment, conflict handling, and a clean, custom-built UI.

---

## 🚀 Project Overview

- A real-time collaborative platform where multiple users can **create, assign, update, drag & drop**, and **complete tasks**.
- Built with a focus on **live updates**, **role-based task assignment**, and **conflict resolution** for simultaneous task edits.

---

## 🧰 Tech Stack Used

### 🖥 Frontend
-- Framework: React (with TypeScript)
-- Styling: Tailwind CSS (Custom UI, no prebuilt component libraries)
-- State Management: React Context + useReducer
-- Realtime Communication: Socket.IO-client

### ⚙️ Backend
-- Runtime & Language: Node.js with TypeScript
-- Framework: Express.js (with MVC architecture)
-- Database: MongoDB (with Mongoose ODM)
-- Realtime Communication: Socket.IO
-- Authentication: JWT (JSON Web Token) with Role-Based Access Control



---

## ⚙️ Setup & Installation Instructions

### 📦 Prerequisites
- Node.js
- MongoDB 
- npm

---

#   🎯 Smart Assign Logic Explanation

The Smart Assign feature optimizes task distribution by analyzing the current number of tasks assigned to each user. Here's how it works:

-- When a task is created or needs to be assigned, the system calculates how many tasks each user has in total.

-- It identifies the user with the least number of active tasks (in Todo or In Progress columns).

-- That user is then assigned to the new task to ensure balanced workload distribution.

-- This logic runs in the backend and updates are pushed in real-time using WebSockets.


#      ⚔️ Conflict Handling Logic
Collab Board supports multiple users working on the same board simultaneously. To ensure consistency:

-- WebSocket Events are used to broadcast task updates (create, move, delete) to all connected users instantly.

-- Optimistic UI is used on the frontend to reflect changes instantly while the backend confirms or rejects them.

-- When two users attempt to update the same task at the same time:

-- The backend checks for the latest update timestamp or lock state.

-- If a conflict is detected (e.g., a task is being moved while another user deletes it), the backend rejects the second action.

-- An error message or UI indication is shown to the user about the conflict.


### 🔧 Backend Setup
npm install

###     Live Deployment Links

--- Frontend => https://collab-board-one.vercel.app/

--- Backend => https://collab-board-1315.onrender.com/
