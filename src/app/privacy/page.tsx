import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Política de Privacidade – RIVOFLOW",
  description: "Como o RIVOFLOW coleta, usa e protege seus dados pessoais.",
};

const sections = [
  {
    title: "1. Informações que Coletamos",
    content:
      "Ao se autenticar via Google, coletamos as informações básicas de perfil fornecidas pela sua conta Google, como nome, endereço de e-mail e foto de perfil. Também coletamos dados de uso da plataforma, como fluxos criados, imagens geradas e consumo de créditos.",
  },
  {
    title: "2. Como Usamos suas Informações",
    content:
      "Utilizamos suas informações para: (a) criar e gerenciar sua conta; (b) processar suas gerações de imagem; (c) calcular e controlar o consumo de créditos; (d) enviar comunicações relacionadas ao serviço; (e) melhorar continuamente a plataforma.",
  },
  {
    title: "3. Compartilhamento de Dados",
    content:
      "Não vendemos seus dados pessoais a terceiros. Podemos compartilhar informações com provedores de serviço essenciais para operação da plataforma (como AWS para armazenamento de imagens e Google para autenticação), sempre sob acordos de confidencialidade.",
  },
  {
    title: "4. Armazenamento de Imagens",
    content:
      "As imagens enviadas como referência e as imagens geradas são armazenadas em servidores seguros na AWS (Amazon Web Services), na região da América do Sul (São Paulo). Você pode excluir suas imagens a qualquer momento através da plataforma.",
  },
  {
    title: "5. Cookies e Tecnologias Similares",
    content:
      "Utilizamos cookies e tokens de sessão para manter você autenticado e lembrar suas preferências. Esses cookies são estritamente necessários para o funcionamento do serviço. Não utilizamos cookies para rastreamento publicitário.",
  },
  {
    title: "6. Segurança",
    content:
      "Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, perda ou destruição. A comunicação entre seu navegador e nossos servidores é protegida por criptografia TLS.",
  },
  {
    title: "7. Seus Direitos (LGPD)",
    content:
      "Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de: acessar seus dados, corrigir informações incorretas, solicitar a exclusão de seus dados, revogar o consentimento e obter informações sobre o compartilhamento de dados. Para exercer esses direitos, entre em contato conosco.",
  },
  {
    title: "8. Retenção de Dados",
    content:
      "Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, seus dados pessoais serão removidos em até 30 dias, salvo obrigações legais que exijam retenção por período maior.",
  },
  {
    title: "9. Menores de Idade",
    content:
      "O RIVOFLOW não é destinado a menores de 18 anos. Não coletamos intencionalmente dados de menores. Se tomarmos conhecimento de que coletamos dados de um menor, removeremos essas informações imediatamente.",
  },
  {
    title: "10. Alterações nesta Política",
    content:
      "Podemos atualizar esta Política periodicamente. Notificaremos sobre mudanças significativas via e-mail ou através de aviso na plataforma. A data da última atualização está sempre indicada no topo desta página.",
  },
  {
    title: "11. Contato",
    content:
      "Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato com nosso responsável pelo tratamento de dados: privacidade@rivocode.com.br.",
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
              src="/rivoflow.png"
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
