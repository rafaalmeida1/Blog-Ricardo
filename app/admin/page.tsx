import { getCurrentUser } from "@/lib/auth-simple"
import { prisma } from "@/lib/prisma"
import { AdminNav } from "@/components/admin/admin-nav"
import { DeleteThesisButton } from "@/components/admin/delete-thesis-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const user = await getCurrentUser()

  const theses = await prisma.thesis.findMany({
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const serializedTheses = theses.map(thesis => ({
    ...thesis,
    createdAt: thesis.createdAt.toISOString(),
    updatedAt: thesis.updatedAt.toISOString(),
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

  const stats = {
    total: serializedTheses.length,
    published: serializedTheses.filter((t) => t.published).length,
    draft: serializedTheses.filter((t) => !t.published).length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav user={user || undefined} />
      
      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas teses e artigos jurídicos</p>
          </div>
          <Link href="/admin/teses/nova" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tese
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Teses</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicadas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rascunhos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Teses</CardTitle>
            <CardDescription>Suas teses mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {serializedTheses.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma tese encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  Comece criando sua primeira tese ou artigo jurídico.
                </p>
                <Link href="/admin/teses/nova">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Tese
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {serializedTheses.map((thesis) => (
                  <div
                    key={thesis.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-slate-50 gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate">{thesis.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant={thesis.published ? "default" : "secondary"} className="text-xs">
                            {thesis.published ? "Publicada" : "Rascunho"}
                          </Badge>
                          <Badge variant="outline" className="text-xs">{thesis.category.name}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {thesis.description}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground mt-2">
                        <span>Criada em {new Date(thesis.createdAt).toLocaleDateString('pt-BR')}</span>
                        <span>{thesis.views} visualizações</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {thesis.published && (
                        <Link href={`/teses/${thesis.slug}`}>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/teses/${thesis.id}/editar`}>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <DeleteThesisButton 
                        thesisId={thesis.id} 
                        thesisTitle={thesis.title} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
