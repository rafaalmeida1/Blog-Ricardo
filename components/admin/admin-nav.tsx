"use client"

import { Button } from "@/components/ui/button"
import { LogOut, FileText, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface AdminNavProps {
  user?: {
    name?: string | null
    email?: string | null
  }
}

export function AdminNav({ user }: AdminNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (response.ok) {
        window.location.href = '/admin/login'
      } else {
        console.error('Logout failed')
        // Force redirect anyway
        window.location.href = '/admin/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect
      window.location.href = '/admin/login'
    }
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-xl font-bold hover:text-primary transition-colors">
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-serif text-lg font-bold">
              Ricardo Lopes de Souza
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                  <Link href="/admin/teses/nova" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Nova Tese
                  </Link>
                </Button>
              </div>
              
              <div className="border-t pt-4">
                <div className="text-sm mb-3">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-muted-foreground text-xs">{user?.email}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
