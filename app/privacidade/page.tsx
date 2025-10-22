import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidade | Ricardo Lopes de Souza",
  description: "Política de privacidade e proteção de dados pessoais do escritório Ricardo Lopes de Souza.",
}

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-6">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Esta Política de Privacidade descreve como o escritório Ricardo Lopes de Souza coleta, 
              usa e protege suas informações pessoais quando você utiliza nossos serviços.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              1. Informações que Coletamos
            </h2>
            <p className="text-slate-600 mb-4">
              Coletamos informações que você nos fornece diretamente, incluindo:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Nome completo e dados de contato</li>
              <li>Informações sobre seu caso jurídico</li>
              <li>Documentos e evidências relacionadas ao seu caso</li>
              <li>Comunicações entre você e nosso escritório</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              2. Como Usamos suas Informações
            </h2>
            <p className="text-slate-600 mb-4">
              Utilizamos suas informações pessoais para:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Prestar serviços jurídicos de qualidade</li>
              <li>Comunicar sobre o andamento de seu caso</li>
              <li>Cumprir obrigações legais e regulamentares</li>
              <li>Melhorar nossos serviços</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              3. Proteção de Dados
            </h2>
            <p className="text-slate-600 mb-6">
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas 
              informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              4. Compartilhamento de Informações
            </h2>
            <p className="text-slate-600 mb-6">
              Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
              exceto quando necessário para prestar nossos serviços ou quando exigido por lei.
            </p>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              5. Seus Direitos
            </h2>
            <p className="text-slate-600 mb-4">
              Você tem o direito de:
            </p>
            <ul className="list-disc pl-6 text-slate-600 mb-6">
              <li>Acessar suas informações pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Retirar seu consentimento a qualquer momento</li>
            </ul>

            <h2 className="font-serif text-2xl font-semibold text-slate-900 mb-4">
              6. Contato
            </h2>
            <p className="text-slate-600 mb-6">
              Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos 
              suas informações pessoais, entre em contato conosco através dos canais disponíveis 
              em nosso site.
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
