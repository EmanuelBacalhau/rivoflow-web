"use client";

import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Background } from "@/components/background";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Background />

      <header className="relative z-10 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="RIVOFLOW"
              width={28}
              height={28}
              priority
              className="rounded-lg w-auto h-auto"
            />
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="text-center px-6 animate-slide-up">
          <p className="text-7xl md:text-8xl font-bold text-destructive/20 leading-none mb-4 select-none">
            Ops!
          </p>
          <h1 className="text-xl font-semibold mb-2">Algo deu errado</h1>
          <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
            Ocorreu um erro inesperado. Tente recarregar a página ou volte ao
            início.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="sm" variant="outline" onClick={reset}>
              <RefreshCwIcon className="w-3.5 h-3.5 mr-1.5" />
              Tentar novamente
            </Button>
            <Link href="/">
              <Button size="sm">
                <ArrowLeftIcon className="w-3.5 h-3.5 mr-1.5" />
                Voltar ao início
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/50 py-5">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} RivoFlow
          </p>
        </div>
      </footer>
    </div>
  );
}
