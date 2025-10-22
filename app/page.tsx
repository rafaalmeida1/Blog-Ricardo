import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { AreasDeAtuacao } from "@/components/areas-de-atuacao"
import { Diferenciais } from "@/components/diferenciais"
import { ContatoForm } from "@/components/contato-form"

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <AreasDeAtuacao />
      <Diferenciais />
      <ContatoForm />
    </>
  )
}
