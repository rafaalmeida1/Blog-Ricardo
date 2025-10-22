"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw, LogIn } from "lucide-react"
import Link from "next/link"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Admin Error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-slate-900 mb-2">
            Erro no Painel Admin
          </h1>
          <p className="text-slate-600">
            Ocorreu um erro no painel administrativo. Tente novamente ou entre em contato com o suporte.
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={reset} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Voltar ao painel
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/admin/login">
              <LogIn className="mr-2 h-4 w-4" />
              Fazer login
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir para o site
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              Detalhes do erro (desenvolvimento)
            </summary>
            <pre className="mt-2 text-xs text-slate-600 bg-slate-100 p-3 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
