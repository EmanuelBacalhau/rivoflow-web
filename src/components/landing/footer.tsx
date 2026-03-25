import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="RIVOFLOW"
                width={24}
                height={24}
                className="rounded-md"
              />
            </Link>
            <span className="text-xs text-muted-foreground">
              Feito por{" "}
              <span className="font-medium text-foreground/70">RivoCode</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
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
            <span>© {new Date().getFullYear()} RivoFlow</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
