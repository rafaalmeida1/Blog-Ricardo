"use client"

import { useState, useMemo } from "react"
import { TeseCard } from "@/components/tese-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface TesesListProps {
  initialTheses: any[]
  categories: any[]
}

export function TesesList({ initialTheses, categories }: TesesListProps) {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todas")
  const [searchQuery, setSearchQuery] = useState("")

  const tesesFiltradas = useMemo(() => {
    let filtered = initialTheses

    // Filter by category
    if (categoriaAtiva !== "Todas") {
      filtered = filtered.filter((tese) => tese.category.name === categoriaAtiva)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tese) =>
          tese.title.toLowerCase().includes(query) ||
          tese.description.toLowerCase().includes(query) ||
          tese.category.name.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [initialTheses, categoriaAtiva, searchQuery])

  const allCategories = ["Todas", ...categories.map((cat) => cat.name)]

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por título, descrição ou categoria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-12">
          <h2 className="font-serif text-2xl font-bold text-center mb-6">Categorias</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {allCategories.map((categoria) => (
              <Button
                key={categoria}
                variant={categoriaAtiva === categoria ? "default" : "outline"}
                onClick={() => setCategoriaAtiva(categoria)}
                className="rounded-full"
              >
                {categoria}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6 text-center text-muted-foreground">
            {tesesFiltradas.length} {tesesFiltradas.length === 1 ? "resultado encontrado" : "resultados encontrados"}
          </div>
        )}

        {/* Thesis Grid */}
        {tesesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tesesFiltradas.map((tese) => (
              <TeseCard key={tese.id} tese={tese} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "Nenhuma tese encontrada para sua busca." : "Nenhuma tese encontrada nesta categoria."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
