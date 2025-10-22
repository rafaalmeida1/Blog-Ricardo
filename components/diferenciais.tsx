import { CheckCircle2 } from "lucide-react"

const diferenciais = [
  {
    title: "Atendimento Personalizado",
    description:
      "Cada caso é único e recebe atenção individualizada, com estratégias desenvolvidas especificamente para suas necessidades.",
  },
  {
    title: "Agilidade",
    description:
      "Resposta rápida e eficiente em situações urgentes, com disponibilidade para atender demandas processuais com a celeridade necessária.",
  },
  {
    title: "Atualização Constante",
    description:
      "Estudo permanente de jurisprudência e doutrina para oferecer as melhores teses e argumentos jurídicos atualizados.",
  },
]

export function Diferenciais() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">Diferenciais</h2>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {diferenciais.map((diferencial) => (
            <div key={diferencial.title} className="flex flex-col items-center text-center">
              <div className="mb-4">
                <CheckCircle2 className="h-12 w-12 text-accent" />
              </div>

              <h3 className="font-serif text-xl font-bold mb-3 text-foreground">{diferencial.title}</h3>

              <p className="text-muted-foreground leading-relaxed text-pretty">{diferencial.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
