import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer>
      <div className="section-glow-divider" />
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="RIVOFLOW"
                width={24}
                height={24}
                priority
                className="rounded-md w-auto h-auto"
              />
            </Link>
            <span className="text-xs text-muted-foreground">
              Feito por{" "}
              <span className="font-medium text-white/60">RivoCode</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <nav aria-label="Links legais" className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors duration-200"
              >
                Privacidade
              </Link>
              <Link
                href="/terms"
                className="hover:text-white transition-colors duration-200"
              >
                Termos
              </Link>
            </nav>
            <span className="text-muted-foreground/50">
              © {new Date().getFullYear()} RivoFlow
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
