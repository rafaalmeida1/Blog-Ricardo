import { PrismaClient } from "@prisma/client"

// Use local database URL for scripts
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:postgres@localhost:5438/ricardo_advogado"
    }
  }
})

async function checkUsers() {
  console.log("🔍 Checking users in database...")
  
  try {
    const users = await prisma.user.findMany()
    
    console.log(`📊 Found ${users.length} users:`)
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user.id}`)
      console.log(`   Email: ${user.email}`)
      console.log(`   Name: ${user.name}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   Created: ${user.createdAt}`)
      console.log("")
    })
    
    if (users.length === 0) {
      console.log("❌ No users found in database!")
    } else {
      console.log("✅ Users found successfully!")
    }
    
  } catch (error) {
    console.error("❌ Error checking users:", error)
  } finally {
    await prisma.$disconnect()
  }
}

checkUsers()
