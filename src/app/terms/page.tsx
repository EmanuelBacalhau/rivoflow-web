import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Termos de Uso – RIVOFLOW",
  description: "Termos e condições de uso da plataforma RIVOFLOW.",
};

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao acessar ou utilizar a plataforma RIVOFLOW, você concorda em cumprir e estar vinculado a estes Termos de Uso. Caso não concorde com alguma parte destes termos, não utilize nossos serviços.",
  },
  {
    title: "2. Descrição do Serviço",
    content:
      "O RIVOFLOW é uma plataforma de criação de imagens e criativos publicitários com inteligência artificial. O serviço permite que usuários criem fluxos visuais para geração de imagens utilizando modelos de IA de terceiros.",
  },
  {
    title: "3. Conta e Acesso",
    content:
      "O acesso à plataforma é feito exclusivamente via autenticação com conta Google. Você é responsável por manter a segurança da sua conta e por todas as atividades realizadas com ela. Nos reservamos o direito de suspender contas que violem estes termos.",
  },
  {
    title: "4. Uso de Créditos",
    content:
      "O RIVOFLOW opera em um sistema de créditos pré-pagos. Cada geração de imagem consome uma quantidade de créditos conforme exibido na plataforma. Créditos não utilizados não expiram, salvo em caso de encerramento de conta. Não há reembolso de créditos já consumidos.",
  },
  {
    title: "5. Conteúdo Gerado",
    content:
      "Você retém os direitos sobre as imagens geradas a partir de seus prompts e referências. Ao utilizar o serviço, você garante que os conteúdos enviados como referência não violam direitos autorais de terceiros. É proibido gerar conteúdo ilegal, difamatório, obsceno ou que viole direitos de terceiros.",
  },
  {
    title: "6. Propriedade Intelectual",
    content:
      "A plataforma RIVOFLOW, incluindo seu código, design e marca, é propriedade da RivoCode. É proibida a reprodução, distribuição ou criação de trabalhos derivados sem autorização expressa.",
  },
  {
    title: "7. Limitação de Responsabilidade",
    content:
      'O RIVOFLOW é fornecido "como está". Não garantimos que o serviço estará disponível de forma ininterrupta ou sem erros. Não nos responsabilizamos por perdas indiretas, incidentais ou consequentes decorrentes do uso da plataforma.',
  },
  {
    title: "8. Modificações",
    content:
      "Podemos alterar estes Termos a qualquer momento. Alterações significativas serão comunicadas via e-mail ou notificação na plataforma. O uso continuado do serviço após as alterações constitui aceitação dos novos termos.",
  },
  {
    title: "9. Lei Aplicável",
    content:
      "Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida no foro da Comarca de São Paulo, SP.",
  },
  {
    title: "10. Contato",
    content:
      "Para dúvidas sobre estes Termos, entre em contato pelo e-mail: suporte@rivocode.com.br.",
  },
];

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: fevereiro de 2026
          </p>
        </div>

        <p className="text-muted-foreground mb-10 leading-relaxed">
          Por favor, leia atentamente estes Termos de Uso antes de utilizar a
          plataforma RIVOFLOW. Eles definem as regras e condições para o uso dos
          nossos serviços.
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
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidade
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
