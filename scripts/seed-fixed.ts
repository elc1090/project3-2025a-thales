const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

async function seedUsers() {
  try {
    console.log("🌱 Criando usuários iniciais...")

    // Limpar dados existentes
    await prisma.bookmark.deleteMany()
    await prisma.user.deleteMany()

    const users = [
      { name: "João Silva", email: "joao@email.com", password: "123456" },
      { name: "Maria Santos", email: "maria@email.com", password: "123456" },
      { name: "Pedro Costa", email: "pedro@email.com", password: "123456" },
      { name: "Ana Oliveira", email: "ana@email.com", password: "123456" },
    ]

    for (const userData of users) {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
        },
      })

      console.log(`✅ Usuário criado: ${user.email} (ID: ${user.id})`)
    }

    console.log("🎉 Seed concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro no seed:", error)
  } finally {
    await prisma.$disconnect()
  }
}

seedUsers()
