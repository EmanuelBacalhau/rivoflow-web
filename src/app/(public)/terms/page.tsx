import { LegalPageLayout } from "@/components/layout/legal-page-layout";

export const metadata = {
  title: "Termos de Uso – RIVOFLOW",
  description: "Termos e condições de uso da plataforma RIVOFLOW.",
};

const sections = [
  {
    title: "1. Aceitação dos Termos",
    content:
      "Ao acessar ou utilizar a plataforma RIVOFLOW, você declara que leu, compreendeu e concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer parte destes termos, não utilize nossos serviços.",
  },
  {
    title: "2. Descrição do Serviço",
    content:
      'O RIVOFLOW é uma plataforma online que permite a criação de imagens e criativos publicitários por meio de fluxos visuais e utilização de modelos de inteligência artificial fornecidos por terceiros. O serviço é disponibilizado na modalidade "como está", podendo sofrer atualizações, modificações ou descontinuações a qualquer momento.',
  },
  {
    title: "3. Cadastro e Acesso",
    content:
      "O acesso à plataforma é realizado exclusivamente por meio de autenticação via conta Google. Ao se autenticar, o usuário autoriza a coleta das informações básicas de perfil disponibilizadas pelo Google, conforme descrito na Política de Privacidade. O usuário é responsável por manter a segurança de sua conta e por todas as atividades realizadas por meio dela. A exclusão automatizada de conta pode não estar disponível na interface, podendo ser solicitada por e-mail.",
  },
  {
    title: "4. Uso de Créditos e Pagamentos",
    content:
      "O RIVOFLOW opera por meio de sistema de créditos pré-pagos. Cada geração de imagem consome créditos conforme informado na plataforma. Créditos adquiridos não são reembolsáveis após utilização. Créditos não utilizados permanecem válidos enquanto a conta estiver ativa. Em caso de encerramento da conta por violação destes Termos, créditos remanescentes poderão ser cancelados sem reembolso.",
  },
  {
    title: "5. Conteúdo do Usuário",
    content:
      "O usuário é integralmente responsável pelos prompts, imagens de referência e demais conteúdos enviados à plataforma. O usuário declara possuir direitos ou autorização para utilizar qualquer conteúdo enviado e compromete-se a não gerar conteúdo ilegal, difamatório, obsceno ou que viole direitos de terceiros. O uso comercial das imagens geradas é de responsabilidade exclusiva do usuário.",
  },
  {
    title: "6. Conteúdo Gerado por Inteligência Artificial",
    content:
      "O RIVOFLOW utiliza modelos de inteligência artificial de terceiros. Na medida permitida pela legislação aplicável, os direitos sobre o conteúdo gerado pertencem ao usuário, observadas as limitações técnicas e as políticas dos provedores de IA utilizados. Não garantimos originalidade absoluta, ausência de similaridade com obras existentes ou adequação a finalidade específica.",
  },
  {
    title: "7. Propriedade Intelectual da Plataforma",
    content:
      "A plataforma RIVOFLOW, incluindo seu software, fluxos, design, marca e identidade visual, é propriedade da RivoCode. É proibida a reprodução, distribuição, engenharia reversa ou criação de trabalhos derivados sem autorização expressa.",
  },
  {
    title: "8. Suspensão e Encerramento",
    content:
      "Podemos suspender ou encerrar contas que violem estes Termos, utilizem a plataforma para fins ilícitos ou gerem riscos jurídicos ou operacionais. O usuário pode solicitar o encerramento da conta por meio do e-mail de suporte.",
  },
  {
    title: "9. Limitação de Responsabilidade",
    content:
      'O serviço é fornecido "como está", sem garantias de disponibilidade contínua ou ausência de erros. O RIVOFLOW não se responsabiliza por perdas indiretas, lucros cessantes ou danos decorrentes de indisponibilidade temporária, falhas técnicas ou uso inadequado do conteúdo gerado.',
  },
  {
    title: "10. Modificações",
    content:
      "Estes Termos podem ser alterados a qualquer momento. Alterações relevantes serão comunicadas por e-mail ou aviso na plataforma. O uso continuado do serviço após as alterações constitui aceitação dos novos Termos.",
  },
  {
    title: "11. Lei Aplicável e Foro",
    content:
      "Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de São Paulo, SP, para dirimir quaisquer controvérsias.",
  },
  {
    title: "12. Contato",
    content:
      "Para dúvidas relacionadas a estes Termos, entre em contato pelo e-mail: suporte@rivocode.com.br.",
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      subtitle="Por favor, leia atentamente estes Termos de Uso antes de utilizar a plataforma RIVOFLOW. Eles definem as regras e condições para o uso dos nossos serviços."
      sections={sections}
      footerLinks={[
        { label: "Política de Privacidade", href: "/privacy" },
        { label: "Entrar", href: "/auth/google" },
      ]}
    />
  );
}
