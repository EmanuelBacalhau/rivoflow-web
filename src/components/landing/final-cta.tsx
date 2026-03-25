import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingFinalCta() {
  return (
    <section className="py-28 bg-card">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-background text-sm text-muted-foreground mb-8">
          <SparklesIcon className="w-4 h-4 text-primary" />
          Créditos que nunca expiram
        </div>

        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-5">
          Sua próxima campanha pronta hoje mesmo
        </h2>

        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Crie sua conta em 1 clique. Sem cartão de crédito no cadastro.
        </p>

        <Link href="/auth/google">
          <Button size="lg" className="h-12 px-10 text-base rounded-xl">
            Criar minha conta
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </Link>

        <p className="text-xs text-muted-foreground mt-6">
          Acesso via Google · Pagamentos seguros via Pix ou Cartão
        </p>
      </div>
    </section>
  );
}
