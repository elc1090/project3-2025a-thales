import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  return null
}

export function verifyToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string; email: string }

    return decoded
  } catch (error) {
    return null
  }
}
