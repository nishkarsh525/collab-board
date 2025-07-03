import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { readData, writeData } from "@/lib/mongodb"
import { type IUser, validateUser, createUser } from "@/models/User"
import { generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    const validationErrors = validateUser({ name, email, password })
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    // Get existing users
    const users = await readData<IUser>("users")

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email.toLowerCase())
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = createUser({ name, email, password: hashedPassword })

    // Save to file
    users.push(user)
    await writeData("users", users)

    // Generate JWT
    const token = generateToken({
      _id: user.id,
      email: user.email,
      name: user.name,
    })

    // Return user without password
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        user: userResponse,
        token,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
