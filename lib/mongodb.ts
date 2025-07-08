import fs from "fs/promises"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Read data from JSON file
export async function readData<T>(filename: string): Promise<T[]> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${filename}.json`)

  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // Return empty array if file doesn't exist
    return []
  }
}

// Write data to JSON file
export async function writeData<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir()
  const filePath = path.join(DATA_DIR, `${filename}.json`)
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// Generate unique ID
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

// Default export for compatibility
export default async function connectDB() {
  await ensureDataDir()
  return true
}
