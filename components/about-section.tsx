export function AboutSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">Sobre</h2>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </div>

        <div className="prose prose-lg max-w-none text-center">
          <p className="text-muted-foreground leading-relaxed text-pretty">
            A advocacia criminal exige não apenas conhecimento técnico profundo, mas também compromisso ético inabalável
            e dedicação integral a cada caso. Com atuação focada na defesa de direitos fundamentais, trabalho para
            garantir que cada cliente receba a melhor defesa possível, com estratégias jurídicas sólidas e
            acompanhamento personalizado em todas as fases processuais.
          </p>

          <p className="text-muted-foreground leading-relaxed mt-6 text-pretty">
            A missão é assegurar que os princípios constitucionais sejam respeitados e que a justiça seja alcançada
            através de uma defesa técnica qualificada, sempre pautada pela ética profissional e pelo respeito ao
            cliente.
          </p>
        </div>
      </div>
    </section>
  )
}
