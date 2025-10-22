import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface TeseCardProps {
  tese: {
    slug: string
    title: string
    description: string
    category: {
      name: string
    }
    publishedAt: Date | null
    coverImage: string | null
    views: number
  }
}

export function TeseCard({ tese }: TeseCardProps) {
  const dataFormatada = tese.publishedAt
    ? format(new Date(tese.publishedAt), "dd 'de' MMMM, yyyy", { locale: ptBR })
    : ""

  return (
    <article className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <Link href={`/teses/${tese.slug}`}>
        <div className="relative h-48 overflow-hidden bg-slate-100">
          {tese.coverImage ? (
            <Image
              src={tese.coverImage || "/placeholder.svg"}
              alt={tese.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-4xl text-slate-400">⚖️</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-full">
            {tese.category.name}
          </span>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {tese.views}
            </div>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {dataFormatada}
            </div>
          </div>
        </div>

        <Link href={`/teses/${tese.slug}`}>
          <h3 className="font-serif text-xl font-bold mb-3 text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-2">
            {tese.title}
          </h3>
        </Link>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">{tese.description}</p>

        <Button asChild variant="ghost" className="group/btn p-0 h-auto text-slate-700 hover:text-slate-900">
          <Link href={`/teses/${tese.slug}`} className="flex items-center">
            Ler mais
            <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
