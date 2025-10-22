import { Suspense } from "react"
import { TesesList } from "@/components/teses-list"
import { BookOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export const metadata = {
  title: "Teses e Artigos Jurídicos | Ricardo Lopes de Souza",
  description: "Publicações jurídicas sobre direito criminal, tribunal do júri, habeas corpus e crimes econômicos.",
}

async function getThesesData() {
  const [theses, categories] = await Promise.all([
    prisma.thesis.findMany({
      where: { published: true },
      include: {
        category: true,
        author: true,
      },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.category.findMany({
      where: {
        theses: {
          some: {
            published: true,
          },
        },
      },
      orderBy: { name: "asc" },
    }),
  ])
  return { theses, categories }
}

export default async function TesesPage() {
  const { theses, categories } = await getThesesData()

  const serializedTheses = theses.map(thesis => ({
    ...thesis,
    createdAt: thesis.createdAt.toISOString(),
    updatedAt: thesis.updatedAt.toISOString(),
    publishedAt: thesis.publishedAt?.toISOString() || null,
    category: {
      ...thesis.category,
      createdAt: thesis.category.createdAt.toISOString(),
      updatedAt: thesis.category.updatedAt.toISOString(),
    },
    author: {
      ...thesis.author,
      createdAt: thesis.author.createdAt.toISOString(),
      updatedAt: thesis.author.updatedAt.toISOString(),
    },
  }))

  const serializedCategories = categories.map(category => ({
    ...category,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  }))

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold mb-4">
            Teses e Artigos Jurídicos
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Publicações jurídicas sobre direito criminal, tribunal do júri, habeas corpus e crimes econômicos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<div className="py-20 text-center">Carregando teses...</div>}>
          <TesesList initialTheses={serializedTheses} categories={serializedCategories} />
        </Suspense>
      </div>
    </div>
  )
}