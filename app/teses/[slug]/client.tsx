"use client"

import { useEffect } from "react"
import { incrementThesisViews } from "@/app/actions/thesis"
import { ThesisContent } from "@/components/thesis-content"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye } from "lucide-react"

interface ThesisPageProps {
  thesis: {
    slug: string
    publishedAt: Date | null
    category: { name: string }
    views: number
    title: string
    description: string
    coverImage: string | null
    coverImagePosition: string | null
    content: any
    author: { name: string }
  }
}

export function TeseClientPage({ thesis }: ThesisPageProps) {
  useEffect(() => {
    // Increment views when component mounts
    incrementThesisViews(thesis.slug)
  }, [thesis.slug])

  return (
    <div className="min-h-screen pt-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{thesis.category.name}</Badge>
          </div>
          
          <h1 className="text-4xl font-serif font-bold mb-4 text-foreground">
            {thesis.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {thesis.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{thesis.author.name}</span>
            </div>
            {thesis.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(thesis.publishedAt).toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{thesis.views} visualizações</span>
            </div>
          </div>
        </header>

        {thesis.coverImage && (
          <div className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden">
              <img
                src={thesis.coverImage}
                alt={thesis.title}
                className="w-full h-full object-cover"
                style={{ objectPosition: thesis.coverImagePosition || 'center' }}
              />
            </div>
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <ThesisContent content={thesis.content} />
        </div>
      </article>
    </div>
  )
}