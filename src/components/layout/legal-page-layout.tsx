import Image from "next/image";
import Link from "next/link";

interface Section {
  title: string;
  content: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface LegalPageLayoutProps {
  title: string;
  subtitle: string;
  sections: Section[];
  footerLinks: FooterLink[];
}

export function LegalPageLayout({
  title,
  subtitle,
  sections,
  footerLinks,
}: LegalPageLayoutProps) {
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
            Voltar ao início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: fevereiro de 2026
          </p>
        </div>

        <p className="text-muted-foreground mb-10 leading-relaxed">
          {subtitle}
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
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
