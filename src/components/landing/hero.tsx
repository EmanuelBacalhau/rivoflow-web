import {
  ArrowRightIcon,
  ImageIcon,
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
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground mb-10 animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-green-500" />
          Sem mensalidades. Pague apenas pelo que usar.
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6 animate-slide-up">
          Crie criativos de alta qualidade com{" "}
          <span className="text-primary">IA</span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 animate-slide-up"
          style={{ animationDelay: "80ms" }}
        >
          Editor visual de fluxos para gerar imagens de campanha
          instantaneamente. Sem assinatura, pague pelo uso.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "160ms" }}
        >
          <Link href="/auth/google">
            <Button size="lg" className="h-12 px-8 text-base rounded-xl">
              Começar grátis
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="#how-it-works">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base rounded-xl"
            >
              Como funciona
            </Button>
          </Link>
        </div>

        {/* Media tags */}
        <div
          className="flex items-center justify-center gap-3 mb-16 animate-fade-in"
          style={{ animationDelay: "240ms" }}
        >
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm">
            <ImageIcon className="w-4 h-4 text-primary" />
            Imagens
          </span>
          <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted-foreground">
            <VideoIcon className="w-4 h-4" />
            Vídeos
            <span className="text-xs text-muted-foreground/60 ml-1">
              em breve
            </span>
          </span>
        </div>

        {/* Metrics */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mb-20 animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          {metrics.map((m, i) => (
            <div key={m.label} className="flex items-center gap-5">
              <div className="text-center">
                <div className="text-3xl font-bold tabular-nums">{m.value}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {m.label}
                </div>
              </div>
              {i < metrics.length - 1 && (
                <div className="hidden sm:block w-px h-10 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCT MOCKUP */}
      <div
        className="relative z-10 max-w-5xl mx-auto px-6 animate-scale-in"
        style={{ animationDelay: "200ms" }}
      >
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-5 h-12 bg-muted/50 border-b border-border">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
              <div className="w-3 h-3 rounded-full bg-border" />
            </div>
            <div className="ml-4 h-6 flex-1 max-w-xs rounded-md bg-background flex items-center px-3">
              <span className="text-xs text-muted-foreground truncate">
                app.rivoflow.com/editor
              </span>
            </div>
          </div>

          <div className="p-10 md:p-16 min-h-60 md:min-h-80 bg-background flex items-center justify-center">
            <div className="flex items-center gap-4 md:gap-6">
              {/* PROMPT NODE */}
              <div className="w-40 md:w-48 p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <WandIcon className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-sm font-medium">Prompt</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  "Produto minimalista, fundo clean, luz suave..."
                </p>
              </div>

              <div className="w-8 md:w-12 h-px bg-border" />

              {/* GENERATION NODE */}
              <div className="w-40 md:w-48 p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Gerador IA</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  1:1 · Qualidade: 4K
                </p>
                <div className="mt-2.5 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-primary font-medium">
                    Processando
                  </span>
                </div>
              </div>

              <div className="w-8 md:w-12 h-px bg-border" />

              {/* RESULT NODE */}
              <div className="relative w-40 md:w-48 p-4 bg-card rounded-xl border border-border shadow-sm">
                <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-green-500 text-white text-[10px] font-semibold rounded-md">
                  Pronto
                </div>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">Criativo</span>
                </div>
                <div className="w-full h-16 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-linear-to-t from-background to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
