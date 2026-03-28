import {
  ArrowRightIcon,
  ImageIcon,
  SparklesIcon,
  VideoIcon,
  WandIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Metric {
  value: string;
  label: string;
}

interface LandingHeroProps {
  metrics: Metric[];
}

export function LandingHero({ metrics }: LandingHeroProps) {
  return (
    <section className="relative overflow-hidden hero-gradient min-h-[90vh] flex flex-col justify-center">
      {/* Grain overlay */}
      <div className="grain absolute inset-0" />

      {/* Vivid glow orbs */}
      <div className="glow-orb w-96 h-96 bg-purple-600/20 -top-20 right-1/4 animate-glow-pulse" />
      <div
        className="glow-orb w-72 h-72 bg-violet-500/15 bottom-20 left-10 animate-glow-pulse"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-0 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ─── LEFT: TEXT CONTENT ─── */}
          <div className="max-w-xl">
            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-7 animate-slide-up">
              Crie criativos
              <br />
              com <span className="text-gradient-primary">IA</span> em
              <br />
              segundos.
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-md animate-slide-up"
              style={{ animationDelay: "100ms" }}
            >
              Editor visual de fluxos para gerar imagens e vídeos de campanha.
              Sem assinatura, sem surpresas.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-10 animate-slide-up delay-200">
              <Link href="/auth/google" className="w-full">
                <Button
                  size="lg"
                  className="h-13 px-10 text-base rounded-full shadow-lg shadow-primary/25 w-full"
                >
                  Começar grátis
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link href="#how-it-works" className="w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-13 px-10 text-base rounded-full w-full"
                >
                  Como funciona
                </Button>
              </Link>
            </div>

            {/* Media tags */}
            <div
              className="flex items-center gap-3 mb-10 animate-fade-in"
              style={{ animationDelay: "300ms" }}
            >
              <Badge
                variant="outline"
                className="px-3.5 py-1 text-xs border-purple-500/20 bg-purple-500/8"
              >
                <ImageIcon className="w-3 h-3 text-purple-400" />
                Imagens
              </Badge>
              <Badge
                variant="outline"
                className="px-3.5 py-1 text-xs border-purple-500/20 bg-purple-500/8"
              >
                <VideoIcon className="w-3 h-3 text-purple-400" />
                Vídeos
              </Badge>
            </div>

            {/* Metrics row */}
            <div
              className="flex items-center gap-0 animate-fade-in"
              style={{ animationDelay: "400ms" }}
            >
              {metrics.map((m, i) => (
                <div key={m.label} className="flex items-center">
                  <div className="text-center px-4 md:px-6 first:pl-0">
                    <div className="font-display text-2xl md:text-3xl font-bold tabular-nums text-white">
                      {m.value}
                    </div>
                    <div className="text-[10px] md:text-xs text-muted-foreground mt-1 tracking-wide">
                      {m.label}
                    </div>
                  </div>
                  {i < metrics.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-8 bg-white/10"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─── RIGHT: ORBITAL VISUALIZATION ─── */}
          <div
            className="relative hidden lg:flex items-center justify-center h-140 animate-fade-in"
            style={{ animationDelay: "500ms" }}
          >
            {/* Orbital rings */}
            <div className="orbital-ring w-80 h-80 orbital-ring-animated" />
            <div className="orbital-ring w-120 h-120 orbital-ring-reverse" />
            <div
              className="orbital-ring w-50 h-50"
              style={{ borderColor: "oklch(1 0 0 / 4%)" }}
            />

            {/* Central stat */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
              <div className="font-display text-5xl font-extrabold text-white">
                10K+
              </div>
              <div className="text-sm text-purple-300/70 mt-1">
                Criativos gerados
              </div>
            </div>

            {/* Ring glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-600/10 blur-3xl" />

            {/* ── Floating node cards ── */}

            {/* Prompt card - top left */}
            <div className="absolute top-6 left-4 hero-float-card rounded-xl p-3.5 w-44 animate-float">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                  <WandIcon className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-white">Prompt</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed">
                "Produto minimalista, fundo clean..."
              </p>
            </div>

            {/* Generator card - right */}
            <div
              className="absolute top-1/3 -right-4 hero-float-card rounded-xl p-3.5 w-44 animate-float"
              style={{ animationDelay: "2s" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <SparklesIcon className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Gerador IA
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[10px] text-purple-400 font-medium">
                  Processando
                </span>
              </div>
            </div>

            {/* Result card - bottom right */}
            <div
              className="absolute bottom-12 right-8 hero-float-card rounded-xl p-3.5 w-44 animate-float"
              style={{ animationDelay: "4s" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-green-500/15 flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-green-400" />
                </div>
                <span className="text-xs font-semibold text-white">
                  Criativo
                </span>
                <Badge className="text-[8px] px-1.5 py-0 h-3.5 bg-green-500 border-0 ml-auto">
                  Pronto
                </Badge>
              </div>
              <div className="w-full h-10 bg-white/5 rounded-md" />
            </div>

            {/* Small floating avatars / accents */}
            <div
              className="absolute top-16 right-24 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/20 flex items-center justify-center animate-float"
              style={{ animationDelay: "1s" }}
            >
              <SparklesIcon className="w-4 h-4 text-purple-400" />
            </div>
            <div
              className="absolute bottom-28 left-12 w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/15 flex items-center justify-center animate-float"
              style={{ animationDelay: "3s" }}
            >
              <ImageIcon className="w-3 h-3 text-amber-400" />
            </div>

            {/* Glowing dots on orbital rings */}
            <div className="absolute top-[15%] left-[55%] w-2 h-2 rounded-full bg-purple-400 shadow-lg shadow-purple-400/50" />
            <div className="absolute bottom-[20%] left-[30%] w-1.5 h-1.5 rounded-full bg-violet-400 shadow-lg shadow-violet-400/50" />
            <div className="absolute top-[45%] right-[5%] w-1.5 h-1.5 rounded-full bg-pink-400 shadow-lg shadow-pink-400/40" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none z-20" />
    </section>
  );
}
