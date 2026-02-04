import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LoadingBar } from "@/components/loading-bar"
import { Toaster } from "sonner"
// Import error handler early
import "@/lib/error-handler"

export const metadata: Metadata = {
  title: "Ricardo Lopes de Souza | Advogado Criminalista",
  description:
    "Defesa criminal com seriedade e dedicação. Especialista em Tribunal do Júri, Habeas Corpus e Crimes Econômicos.",
  keywords: [
    "advogado criminalista",
    "defesa criminal",
    "tribunal do júri",
    "habeas corpus",
    "crimes econômicos",
    "Ricardo Lopes de Souza",
  ],
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans">
        <LoadingBar />
        <Header />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
