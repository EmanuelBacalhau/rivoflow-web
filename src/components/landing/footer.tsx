import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="RIVOFLOW"
                width={26}
                height={26}
                className="rounded-md"
              />
            </Link>

            <p className="text-[11px] text-muted-foreground">
              Feito por{" "}
              <span className="font-medium text-foreground">RivoCode</span>
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-6 text-xs text-muted-foreground">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Termos
            </Link>
            <p>
              © {new Date().getFullYear()} RivoFlow. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
