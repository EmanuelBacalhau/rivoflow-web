"use client";

import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <Link href="/">
            <Image
              src="/rivoflow.png"
              alt="RIVOFLOW"
              width={36}
              height={36}
              className="rounded-xl"
            />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/8 via-transparent to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
          {/* 404 number */}
          <p className="text-8xl md:text-9xl font-bold bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent leading-none mb-4 select-none">
            404
          </p>

          <h1 className="text-2xl md:text-3xl font-bold mb-3">
            Página não encontrada
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-10">
            O endereço que você tentou acessar não existe ou foi removido.
            Verifique o link ou volte para o início.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
              >
                <HomeIcon className="w-4 h-4 mr-2" />
                Ir para o início
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-11 px-8 rounded-xl border-border/60"
              onClick={() => history.back()}
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} RivoFlow. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
