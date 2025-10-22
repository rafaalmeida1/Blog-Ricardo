import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create default categories
  const categories = [
    { name: "Tribunal do Júri", slug: "tribunal-do-juri" },
    { name: "Habeas Corpus", slug: "habeas-corpus" },
    { name: "Recursos", slug: "recursos" },
    { name: "Crimes Econômicos", slug: "crimes-economicos" },
    { name: "Direito Penal", slug: "direito-penal" },
    { name: "Processo Penal", slug: "processo-penal" },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log("✅ Categories created")

  console.log("🎉 Seeding completed!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
