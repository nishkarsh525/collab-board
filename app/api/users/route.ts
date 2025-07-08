import { type NextRequest, NextResponse } from "next/server"
import { readData } from "@/lib/mongodb"
import type { IUser } from "@/models/User"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const user = verifyToken(request)
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await readData<IUser>("users")

    const formattedUsers = users
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(formattedUsers)
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
