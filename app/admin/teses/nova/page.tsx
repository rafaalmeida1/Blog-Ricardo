import { getCurrentUser } from "@/lib/auth-simple"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { ThesisForm } from "@/components/admin/thesis-form"

export const dynamic = 'force-dynamic'

export default async function NewThesisPage() {
  const user = await getCurrentUser()

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  })

  const serializedCategories = categories.map(category => ({
    id: category.id,
    name: category.name,
  }))

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav user={user} />

      <main className="max-w-5xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-serif font-bold">Nova Tese</h1>
          <p className="text-muted-foreground mt-1">Crie uma nova tese ou artigo jurídico</p>
        </div>

        <ThesisForm 
          categories={serializedCategories} 
          authorId={user?.id || ''} 
        />
      </main>
    </div>
  )
}