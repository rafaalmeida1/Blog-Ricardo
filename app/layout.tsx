import type React from "react"
import type { Metadata } from "next"
import { Inter, Merriweather } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
})

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
    <html lang="pt-BR" className={`${inter.variable} ${merriweather.variable} antialiased`}>
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
