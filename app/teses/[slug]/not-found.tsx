import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function ThesisNotFound() {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <FileQuestion className="h-20 w-20 mx-auto mb-6 text-slate-400" />
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-4">Tese não encontrada</h1>
        <p className="text-slate-600 mb-8">A tese que você está procurando não existe ou foi removida.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline">
            <Link href="/teses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ver todas as teses
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
