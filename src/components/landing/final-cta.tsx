import { ArrowRightIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingFinalCta() {
  return (
    <section className="py-28 relative overflow-hidden bg-muted/20">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-500/5 to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-6">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Créditos que nunca expiram</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-5">
          Sua próxima campanha pronta{" "}
          <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            hoje mesmo.
          </span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Abandone os bloqueios criativos. Crie sua conta em 1 clique sem
          informar cartão de crédito no cadastro e veja a mágica acontecer.
        </p>
        <Link href="/auth/google">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-10 h-12 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            Criar meu primeiro criativo
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-4">
          Acesso via Google · Recargas e pagamentos seguros via Pix ou Cartão
        </p>
      </div>
    </section>
  );
}
