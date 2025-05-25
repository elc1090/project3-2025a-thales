import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// GET - Listar todos os bookmarks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""

    const bookmarks = await prisma.bookmark.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      where: search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(bookmarks)
  } catch (error) {
    console.error("Erro ao buscar bookmarks:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Criar novo bookmark
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Token de autorização necessário" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }
    } catch {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { title, description, url } = await request.json()

    // Validação
    if (!title || !description || !url) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    // Validar URL
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 })
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        title,
        description,
        url,
        userId: decoded.userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(bookmark, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar bookmark:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
