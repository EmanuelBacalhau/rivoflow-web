import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade – RIVOFLOW",
  description: "Como o RIVOFLOW coleta, usa e protege seus dados pessoais.",
};

const sections = [
  {
    title: "1. Controlador dos Dados",
    content:
      "A RivoCode é a controladora dos dados pessoais tratados na plataforma RIVOFLOW, sendo responsável pelas decisões relacionadas ao tratamento dessas informações.",
  },
  {
    title: "2. Dados Coletados",
    content:
      "Ao se autenticar via Google, coletamos informações básicas de perfil como nome, e-mail e foto. Também coletamos dados de uso da plataforma, como fluxos criados, imagens geradas, consumo de créditos e registros técnicos necessários para funcionamento do serviço.",
  },
  {
    title: "3. Bases Legais do Tratamento",
    content:
      "O tratamento de dados pessoais é realizado com fundamento nas hipóteses legais previstas na Lei Geral de Proteção de Dados (Lei nº 13.709/2018), incluindo execução de contrato, cumprimento de obrigação legal, legítimo interesse e consentimento, quando aplicável.",
  },
  {
    title: "4. Finalidade do Uso dos Dados",
    content:
      "Utilizamos seus dados para criar e gerenciar sua conta, processar gerações de imagens, controlar créditos, enviar comunicações relacionadas ao serviço e melhorar continuamente a plataforma.",
  },
  {
    title: "5. Compartilhamento de Dados",
    content:
      "Podemos compartilhar informações com provedores essenciais para a operação da plataforma, como Google (autenticação), provedores de modelos de IA, serviços de armazenamento em nuvem (AWS) e processadores de pagamento. Não vendemos dados pessoais.",
  },
  {
    title: "6. Transferência Internacional",
    content:
      "Alguns dados podem ser processados fora do Brasil por provedores de tecnologia utilizados pela plataforma, observadas as garantias legais previstas na LGPD.",
  },
  {
    title: "7. Armazenamento e Retenção",
    content:
      "Mantemos seus dados enquanto sua conta estiver ativa. Após solicitação de exclusão, os dados pessoais serão removidos em até 30 dias, salvo obrigações legais que exijam retenção por período maior.",
  },
  {
    title: "8. Segurança",
    content:
      "Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição. A comunicação entre seu navegador e nossos servidores é protegida por criptografia TLS.",
  },
  {
    title: "9. Direitos do Titular",
    content:
      "Nos termos da LGPD, você pode solicitar acesso, correção, exclusão, portabilidade de dados, revogação de consentimento e informações sobre compartilhamento. Solicitações devem ser feitas pelo e-mail de contato.",
  },
  {
    title: "10. Menores de Idade",
    content:
      "O RIVOFLOW não é destinado a menores de 18 anos. Caso identifiquemos coleta não intencional de dados de menores, tomaremos as medidas necessárias para removê-los.",
  },
  {
    title: "11. Alterações nesta Política",
    content:
      "Esta Política pode ser atualizada periodicamente. Mudanças relevantes serão comunicadas por e-mail ou aviso na plataforma. A data da última atualização estará sempre indicada no topo da página.",
  },
  {
    title: "12. Contato",
    content:
      "Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato pelo e-mail: privacidade@rivocode.com.br.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="RIVOFLOW"
              width={26}
              height={26}
              className="rounded-md"
            />
            <span className="text-sm font-semibold tracking-tight">
              RIVOFLOW
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: fevereiro de 2026
          </p>
        </div>

        <p className="text-muted-foreground mb-10 leading-relaxed">
          Esta Política de Privacidade descreve como o RIVOFLOW coleta, usa e
          protege suas informações pessoais em conformidade com a Lei Geral de
          Proteção de Dados (LGPD – Lei nº 13.709/2018).
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-base font-semibold mb-2">{section.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} RivoFlow. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-5">
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Termos de Uso
            </Link>
            <Link
              href="/auth/google"
              className="hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
