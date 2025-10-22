"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Mail, Phone, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function ContatoForm() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const mensagemWhatsApp = `Olá! Meu nome é ${formData.nome}.%0A%0AEmail: ${formData.email}%0ATelefone: ${formData.telefone}%0A%0AMensagem: ${formData.mensagem}`
    window.open(`https://wa.me/5519983003028?text=${mensagemWhatsApp}`, "_blank")
  }

  const handleWhatsAppDirect = () => {
    window.open("https://wa.me/5519983003028", "_blank")
  }

  return (
    <section id="contato" className="py-24 bg-gradient-to-br from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Entre em Contato</h2>
          <div className="w-20 h-1 bg-slate-900 mx-auto mb-6" />
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Tire suas dúvidas ou agende uma consulta. Estou à disposição para ajudá-lo com a melhor defesa possível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="ml-4 font-semibold text-slate-900">E-mail</h3>
              </div>
              <a
                href="mailto:ricardoped14@gmail.com"
                className="text-slate-600 hover:text-slate-900 transition-colors break-all"
              >
                ricardoped14@gmail.com
              </a>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="ml-4 font-semibold text-slate-900">Telefone</h3>
              </div>
              <a href="tel:+5519983003028" className="text-slate-600 hover:text-slate-900 transition-colors">
                (19) 98300-3028
              </a>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-900 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="ml-4 font-semibold text-slate-900">Horário</h3>
              </div>
              <p className="text-slate-600">
                Seg - Sex: 9h às 18h
                <br />
                Sáb: 9h às 13h
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-slate-900 mb-2">
                    Nome completo *
                  </label>
                  <Input
                    id="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Seu nome"
                    className="h-12"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-900 mb-2">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-slate-900 mb-2">
                  Telefone
                </label>
                <Input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="mensagem" className="block text-sm font-medium text-slate-900 mb-2">
                  Mensagem *
                </label>
                <Textarea
                  id="mensagem"
                  required
                  rows={5}
                  value={formData.mensagem}
                  onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                  placeholder="Descreva brevemente sua situação..."
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" size="lg" className="flex-1 h-12">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Enviar via WhatsApp
                </Button>

                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handleWhatsAppDirect}
                  className="flex-1 h-12 bg-transparent"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  WhatsApp Direto
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
