import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Termos de Uso | Ricardo Lopes de Souza",
  description: "Termos de uso e condições de prestação de serviços do escritório Ricardo Lopes de Souza.",
}

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-6">
            Termos de Uso
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Estes Termos de Uso regem o uso do site e dos serviços oferecidos pelo escritório 
              Ricardo Lopes de Souza. Ao utilizar nossos serviços, você concorda com estes termos.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-slate-600 mb-6">
              Ao acessar e utilizar este site, você aceita e concorda em cumprir estes Termos de Uso 
              e todas as leis e regulamentos aplicáveis. Se você não concordar com qualquer parte 
              destes termos, não deve utilizar nossos serviços.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              2. Serviços Jurídicos
            </h2>
            <p className="text-slate-600 mb-4">
              O escritório Ricardo Lopes de Souza oferece serviços jurídicos especializados em:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Direito Criminal</li>
              <li>Defesa em Tribunal do Júri</li>
              <li>Habeas Corpus</li>
              <li>Crimes Econômicos</li>
              <li>Consultoria jurídica especializada</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              3. Responsabilidades do Cliente
            </h2>
            <p className="text-slate-600 mb-4">
              O cliente se compromete a:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Fornecer informações verdadeiras e completas</li>
              <li>Colaborar com o andamento do processo</li>
              <li>Efetuar os pagamentos conforme acordado</li>
              <li>Manter sigilo sobre estratégias de defesa</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              4. Sigilo Profissional
            </h2>
            <p className="text-slate-600 mb-6">
              Todas as informações compartilhadas entre cliente e advogado são protegidas pelo 
              sigilo profissional, conforme estabelecido pelo Código de Ética da OAB.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              5. Limitação de Responsabilidade
            </h2>
            <p className="text-slate-600 mb-6">
              Embora nos esforcemos para prestar serviços jurídicos de excelência, não podemos 
              garantir resultados específicos em processos judiciais, pois estes dependem de 
              diversos fatores externos ao nosso controle.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              6. Propriedade Intelectual
            </h2>
            <p className="text-slate-600 mb-6">
              Todo o conteúdo deste site, incluindo textos, imagens, logotipos e materiais 
              educativos, é propriedade do escritório Ricardo Lopes de Souza e está protegido 
              por leis de direitos autorais.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              7. Modificações dos Termos
            </h2>
            <p className="text-slate-600 mb-6">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              As alterações entrarão em vigor imediatamente após sua publicação no site.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              8. Lei Aplicável
            </h2>
            <p className="text-slate-600 mb-6">
              Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será 
              resolvida nos tribunais competentes do Brasil.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              9. Contato
            </h2>
            <p className="text-slate-600 mb-6">
              Para esclarecimentos sobre estes Termos de Uso, entre em contato conosco através 
              dos canais disponíveis em nosso site.
            </p>

            <p className="text-sm text-slate-500 mt-8">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
