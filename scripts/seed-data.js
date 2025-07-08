const fs = require("fs").promises
const path = require("path")
const bcrypt = require("bcryptjs")

const DATA_DIR = path.join(process.cwd(), "data")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function seedData() {
  await ensureDataDir()

  // Create sample users
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("password123", 12),
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("password123", 12),
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      password: await bcrypt.hash("password123", 12),
      createdAt: new Date().toISOString(),
    },
  ]

  // Create sample tasks
  const tasks = [
    {
      id: "1",
      title: "Design user interface",
      description: "Create mockups for the new dashboard",
      status: "todo",
      priority: "high",
      assignedTo: "1",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: "2",
      title: "Implement authentication",
      description: "Set up JWT-based authentication system",
      status: "in-progress",
      priority: "high",
      assignedTo: "2",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: "3",
      title: "Write documentation",
      description: "Document the API endpoints",
      status: "todo",
      priority: "medium",
      assignedTo: "3",
      createdBy: "2",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: "4",
      title: "Setup database",
      description: "Configure MongoDB connection",
      status: "done",
      priority: "high",
      assignedTo: "2",
      createdBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: "5",
      title: "Test application",
      description: "Run comprehensive tests",
      status: "todo",
      priority: "low",
      assignedTo: null,
      createdBy: "3",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  ]

  // Create sample activities
  const activities = [
    {
      id: "1",
      type: "created",
      userId: "1",
      userName: "John Doe",
      action: "created a task",
      taskId: "1",
      taskTitle: "Design user interface",
      timestamp: new Date().toISOString(),
    },
    {
      id: "2",
      type: "assigned",
      userId: "1",
      userName: "John Doe",
      action: "assigned task to Jane Smith",
      taskId: "2",
      taskTitle: "Implement authentication",
      timestamp: new Date().toISOString(),
    },
    {
      id: "3",
      type: "moved",
      userId: "2",
      userName: "Jane Smith",
      action: "moved task to in progress",
      taskId: "2",
      taskTitle: "Implement authentication",
      timestamp: new Date().toISOString(),
    },
  ]

  // Write data to files
  await fs.writeFile(path.join(DATA_DIR, "users.json"), JSON.stringify(users, null, 2))
  await fs.writeFile(path.join(DATA_DIR, "tasks.json"), JSON.stringify(tasks, null, 2))
  await fs.writeFile(path.join(DATA_DIR, "activities.json"), JSON.stringify(activities, null, 2))

  console.log("✅ Sample data created successfully!")
  console.log("📧 Login credentials:")
  console.log("   john@example.com / password123")
  console.log("   jane@example.com / password123")
  console.log("   bob@example.com / password123")
}

seedData().catch(console.error)
