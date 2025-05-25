import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string; email: string }

    // Buscar usuário no banco para garantir que ainda existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Erro na verificação do token:", error)
    return NextResponse.json({ error: "Token inválido" }, { status: 401 })
  } finally {
    await prisma.$disconnect()
  }
}
