import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function LandingFinalCta() {
  return (
    <section
      className="relative py-32 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      <div className="section-glow-divider" aria-hidden="true" />

      {/* Background glow */}
      <div
        className="glow-orb w-96 h-96 bg-purple-600/15 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-glow-pulse"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-linear-to-b from-transparent via-purple-600/4 to-transparent"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center pt-8">
        <Badge
          variant="outline"
          className="px-4 py-1.5 text-sm font-medium border-purple-500/20 bg-purple-500/10 text-purple-300 mb-8"
        >
          <SparklesIcon
            className="w-3.5 h-3.5 text-purple-400"
            aria-hidden="true"
          />
          Créditos que nunca expiram
        </Badge>

        <h2
          id="cta-heading"
          className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white"
        >
          Sua próxima campanha{" "}
          <span className="text-gradient-primary">pronta hoje mesmo</span>
        </h2>

        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Crie sua conta em 1 clique. Sem cartão de crédito no cadastro.
        </p>

        <Link href="/auth/google">
          <Button
            size="lg"
            className="h-13 px-10 text-base rounded-full shadow-lg shadow-primary/25"
          >
            Criar minha conta
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground/50 mt-8 tracking-wide">
          Acesso via Google · Pagamentos seguros via Pix ou Cartão
        </p>
      </div>
    </section>
  );
}
