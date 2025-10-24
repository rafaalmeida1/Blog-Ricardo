import { getCurrentUser } from "@/lib/auth-simple"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { ThesisForm } from "@/components/admin/thesis-form"
import { DeleteThesisButton } from "@/components/admin/delete-thesis-button"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function EditThesisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getCurrentUser()

  const [thesis, categories] = await Promise.all([
    prisma.thesis.findUnique({
      where: { id },
      include: {
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ])

  if (!thesis) {
    notFound()
  }

  const serializedThesis = {
    id: thesis.id,
    title: thesis.title,
    description: thesis.description,
    categoryId: thesis.categoryId,
    published: thesis.published,
    coverImage: thesis.coverImage,
    coverImagePosition: thesis.coverImagePosition,
    content: (() => {
      try {
        if (typeof thesis.content === 'string') {
          return JSON.parse(thesis.content)
        }
        if (typeof thesis.content === 'object' && thesis.content !== null) {
          return thesis.content
        }
        return { type: 'doc', content: [] }
      } catch (error) {
        console.error('Error parsing content:', error)
        return { type: 'doc', content: [] }
      }
    })(),
  }

  console.log('Raw thesis from DB:', thesis)
  console.log('Serialized thesis:', serializedThesis)
  console.log('Categories from DB:', categories)

  const serializedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav user={user || undefined} />

      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Editar Tese</h1>
            <p className="text-muted-foreground mt-1">Atualize as informações da tese</p>
          </div>
          <DeleteThesisButton 
            thesisId={thesis.id} 
            thesisTitle={thesis.title} 
          />
        </div>

        <ThesisForm 
          categories={serializedCategories} 
          authorId={user?.id || ''} 
          thesis={serializedThesis}
        />
      </main>
    </div>
  )
}