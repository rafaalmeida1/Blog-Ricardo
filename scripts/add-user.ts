import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

// Use DATABASE_URL from environment if available (Docker), otherwise use localhost
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5438/ricardo_advogado"

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
})

async function addUser() {
  const args = process.argv.slice(2)
  
  if (args.length < 3) {
    console.log("❌ Uso: npm run add-user <email> <senha> <nome>")
    console.log("📝 Exemplo: npm run add-user joao@email.com senha123 'João Silva'")
    console.log("ℹ️  Nota: Todos os usuários são admins. Visitantes são guests sem login.")
    process.exit(1)
  }

  const [email, password, name] = args

  try {
    console.log("👤 Criando usuário admin...")
    
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name,
        role: "admin", // Only admin role exists
      },
      create: {
        email,
        password: hashedPassword,
        name,
        role: "admin", // Only admin role exists
      },
    })

    console.log("✅ Usuário admin criado/atualizado com sucesso!")
    console.log(`📧 Email: ${user.email}`)
    console.log(`👤 Nome: ${user.name}`)
    console.log(`🔑 Role: ${user.role} (único tipo de usuário)`)
    console.log(`🆔 ID: ${user.id}`)
    console.log("ℹ️  Visitantes acessam o site como guests, sem login.")
    
  } catch (error) {
    console.error("❌ Erro ao criar usuário:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

addUser()
