"use client"

import { Button } from "@/components/ui/button"
import { LogOut, FileText, Home } from "lucide-react"
import Link from "next/link"

interface AdminNavProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function AdminNav({ user }: AdminNavProps) {
  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-xl font-bold">
              Ricardo Lopes de Souza
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin">
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/teses/nova">
                  <FileText className="h-4 w-4 mr-2" />
                  Nova Tese
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right">
              <p className="font-medium">{user?.name}</p>
              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={async () => {
              await fetch('/api/logout', { method: 'POST' })
              window.location.href = '/admin/login'
            }}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
