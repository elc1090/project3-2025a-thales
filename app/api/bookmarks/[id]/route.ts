import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

// GET - Buscar bookmark específico
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id: params.id },
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

    if (!bookmark) {
      return NextResponse.json({ error: "Bookmark não encontrado" }, { status: 404 })
    }

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error("Erro ao buscar bookmark:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Atualizar bookmark
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar se o bookmark existe e se o usuário é o dono
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { id: params.id },
    })

    if (!existingBookmark) {
      return NextResponse.json({ error: "Bookmark não encontrado" }, { status: 404 })
    }

    if (existingBookmark.userId !== decoded.userId) {
      return NextResponse.json({ error: "Você só pode editar seus próprios bookmarks" }, { status: 403 })
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

    const bookmark = await prisma.bookmark.update({
      where: { id: params.id },
      data: {
        title,
        description,
        url,
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

    return NextResponse.json(bookmark)
  } catch (error) {
    console.error("Erro ao atualizar bookmark:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Excluir bookmark
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verificar se o bookmark existe e se o usuário é o dono
    const existingBookmark = await prisma.bookmark.findUnique({
      where: { id: params.id },
    })

    if (!existingBookmark) {
      return NextResponse.json({ error: "Bookmark não encontrado" }, { status: 404 })
    }

    if (existingBookmark.userId !== decoded.userId) {
      return NextResponse.json({ error: "Você só pode excluir seus próprios bookmarks" }, { status: 403 })
    }

    await prisma.bookmark.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Bookmark excluído com sucesso" })
  } catch (error) {
    console.error("Erro ao excluir bookmark:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
