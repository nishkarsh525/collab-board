import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

interface TokenPayload {
  userId: string
  email: string
  name: string
}

export function generateToken(user: { _id: string; email: string; name: string }): string {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: "7d" },
  )
}

export function verifyToken(request: NextRequest): TokenPayload | null {
  const authHeader = request.headers.get("authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as TokenPayload
  } catch {
    return null
  }
}
