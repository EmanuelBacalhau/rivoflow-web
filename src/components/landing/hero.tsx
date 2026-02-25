import {
  ArrowRightIcon,
  ImageIcon,
  RocketIcon,
  SparklesIcon,
  VideoIcon,
  WandIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Metric {
  value: string;
  label: string;
}

interface LandingHeroProps {
  metrics: Metric[];
}

export function LandingHero({ metrics }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20">
      <div className="absolute inset-0 bg-linear-to-b from-primary/8 via-transparent to-transparent" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-primary text-xs font-medium mb-8">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Sem mensalidades. Pague apenas pelo que usar.</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
          <span>A forma mais fácil de</span>
          <br />
          <span>criar seus </span>
          <span className="bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            criativos
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed mb-4">
          Utilize nosso editor visual de fluxos com IA para gerar campanhas e
          imagens de alta qualidade instantaneamente. Sem mensalidades, com a
          mais alta precisão.
        </p>

        {/* MEDIA TYPE TAGS */}
        <div className="flex items-center justify-center gap-3 mb-10 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            <ImageIcon className="w-3.5 h-3.5" />
            Imagens
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <VideoIcon className="w-3.5 h-3.5" />
            Vídeos
            <span className="bg-blue-500/20 px-1.5 py-0.5 rounded-full text-[10px]">
              Em breve
            </span>
          </span>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link href="/auth/google">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 h-12 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02]"
            >
              <RocketIcon className="w-4 h-4 mr-2" />
              Criar minha conta
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Metrics */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
              {i < metrics.length - 1 && (
                <div className="hidden sm:block w-px h-8 bg-border/50" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT MOCKUP */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-16">
        <div className="relative">
          <div className="absolute -inset-3 bg-linear-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60" />
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
            {/* BROWSER CHROME */}
            <div className="flex items-center gap-1.5 px-4 h-10 bg-muted/60 border-b border-border/50">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
              <span className="ml-4 text-xs text-muted-foreground">
                RivoFlow — Editor Visual
              </span>
            </div>
            <div className="p-8 md:p-14 min-h-56 md:min-h-80 bg-muted/10 flex items-center justify-center">
              <div className="flex items-center gap-4 md:gap-6">
                {/* PROMPT NODE */}
                <div className="w-36 md:w-40 p-4 bg-card rounded-xl border border-amber-500/40 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                      <WandIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">Prompt</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    "Produto minimalista, fundo clean, luz suave..."
                  </p>
                </div>

                <div className="w-8 md:w-12 h-0.5 bg-linear-to-r from-amber-400 to-indigo-500 rounded-full" />

                {/* GENERATION NODE */}
                <div className="w-36 md:w-40 p-4 bg-card rounded-xl border border-indigo-500/40 shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                      <SparklesIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">Gerador IA</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Proporção: 1:1 · Qualidade: 4K
                  </p>
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="text-[9px] text-primary font-medium">
                      Processando
                    </span>
                  </div>
                </div>

                <div className="w-8 md:w-12 h-0.5 bg-linear-to-r from-indigo-400 to-green-500 rounded-full" />

                {/* RESULT NODE */}
                <div className="relative w-36 md:w-40 p-4 bg-card rounded-xl border border-green-500/40 shadow-lg">
                  <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-500 text-white text-[9px] font-bold rounded-full">
                    ✓ Pronto
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <ImageIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-xs font-semibold">Criativo</span>
                  </div>
                  <div className="w-full h-14 bg-linear-to-br from-indigo-200 to-blue-200 dark:from-indigo-900/60 dark:to-blue-900/60 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
