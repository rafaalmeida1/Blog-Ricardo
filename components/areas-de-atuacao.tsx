import { Scale, FileText, Briefcase } from "lucide-react"

const areas = [
  {
    icon: Scale,
    title: "Tribunal do Júri",
    description:
      "Defesa técnica especializada em crimes dolosos contra a vida, com preparação estratégica e atuação experiente perante o júri popular.",
  },
  {
    icon: FileText,
    title: "Habeas Corpus",
    description:
      "Impetração de habeas corpus para proteção da liberdade de locomoção, combatendo prisões ilegais e constrangimentos indevidos.",
  },
  {
    icon: Briefcase,
    title: "Crimes Econômicos",
    description:
      "Atuação em casos complexos envolvendo crimes contra o sistema financeiro, lavagem de dinheiro e crimes tributários.",
  },
]

export function AreasDeAtuacao() {
  return (
    <section id="areas" className="py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-primary mb-4">Áreas de Atuação</h2>
          <div className="w-20 h-1 bg-accent mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {areas.map((area) => (
            <div
              key={area.title}
              className="bg-card p-8 rounded-lg border border-border hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <area.icon className="h-8 w-8 text-accent" />
                </div>
              </div>

              <h3 className="font-serif text-xl font-bold text-center mb-4 text-card-foreground">{area.title}</h3>

              <p className="text-muted-foreground text-center leading-relaxed text-pretty">{area.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
