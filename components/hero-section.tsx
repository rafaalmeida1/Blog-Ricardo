import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Scale, Shield, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Scale className="absolute top-20 left-10 h-16 w-16 text-white/5 animate-float" />
        <Shield
          className="absolute bottom-32 right-20 h-20 w-20 text-white/5 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <Award
          className="absolute top-1/3 right-1/4 h-12 w-12 text-white/5 animate-float"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
          <Scale className="h-4 w-4" />
          <span className="text-sm font-medium">Advocacia Criminal Especializada</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
          Defesa Criminal com{" "}
          <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            seriedade e dedicação
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Atuação especializada em casos criminais complexos, com compromisso ético e defesa técnica de excelência.
          Protegendo seus direitos com estratégia e experiência.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-white text-slate-900 hover:bg-slate-100 text-base font-semibold shadow-xl"
          >
            <Link href="#contato">
              Entre em contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 text-base font-semibold bg-white/5 backdrop-blur-sm"
          >
            <Link href="#areas">Áreas de Atuação</Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">15+</div>
            <div className="text-sm text-slate-400">Anos de Experiência</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-3xl font-bold mb-1">500+</div>
            <div className="text-sm text-slate-400">Casos Atendidos</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">95%</div>
            <div className="text-sm text-slate-400">Taxa de Sucesso</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
