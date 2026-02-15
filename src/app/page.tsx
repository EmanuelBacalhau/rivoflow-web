"use client";

import {
  ArrowRightIcon,
  CheckIcon,
  ImageIcon,
  LayoutGridIcon,
  MonitorPlayIcon,
  MousePointerClickIcon,
  PlayCircleIcon,
  RocketIcon,
  ShoppingBagIcon,
  SparklesIcon,
  VideoIcon,
  WandIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const useCases = [
  {
    icon: LayoutGridIcon,
    title: "Social Media",
    description: "Posts, stories e reels que engajam",
    color: "from-pink-500 to-purple-500",
  },
  {
    icon: ShoppingBagIcon,
    title: "E-commerce",
    description: "Fotos de produtos que vendem",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: PlayCircleIcon,
    title: "YouTube & Ads",
    description: "Thumbnails e anúncios em vídeo",
    color: "from-red-500 to-red-600",
  },
  {
    icon: MonitorPlayIcon,
    title: "Apresentações",
    description: "Visuais impactantes para pitch decks",
    color: "from-blue-500 to-cyan-500",
  },
];

const features = [
  "Gere imagens em segundos",
  "Vídeos com IA (em breve)",
  "Múltiplos formatos e resoluções",
  "Use referências visuais",
  "Fluxo visual intuitivo",
  "Exporte em alta qualidade",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 via-background to-blue-500/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-purple-500/30 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-0 w-150 h-150 bg-blue-500/30 rounded-full blur-3xl opacity-20" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl rotate-12 opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-xl -rotate-12 opacity-20 animate-pulse" />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-linear-to-br from-amber-400 to-amber-600 rounded-lg rotate-45 opacity-20 animate-pulse" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium">
              <SparklesIcon className="w-4 h-4" />
              <span>Powered by Google Gemini AI</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Crie seus</span>
              <br />
              <span className="bg-linear-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Criativos
              </span>{" "}
              <span className="text-foreground">em Minutos</span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
              Transforme ideias em{" "}
              <span className="text-purple-600 font-medium">imagens</span> e{" "}
              <span className="text-blue-600 font-medium">vídeos</span>{" "}
              profissionais para suas campanhas. Sem designer, sem complicação.
            </p>

            {/* Media Types */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600">
                <ImageIcon className="w-4 h-4" />
                <span>Imagens</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600">
                <VideoIcon className="w-4 h-4" />
                <span>Vídeos</span>
                <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded-full">
                  Em breve
                </span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
                >
                  <RocketIcon className="w-5 h-5 mr-2" />
                  Criar Meu Criativo
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg rounded-xl border-2 hover:bg-accent transition-all"
              >
                <MousePointerClickIcon className="w-5 h-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-16 md:mt-24 relative">
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-10 bg-card border-b border-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-muted-foreground">
                  Orion Flow Editor
                </span>
              </div>
              <div className="pt-10 p-8 min-h-75 md:min-h-100 bg-linear-to-br from-muted/30 to-muted/10 flex items-center justify-center">
                <div className="flex items-center gap-4 md:gap-8">
                  {/* Node Preview 1 */}
                  <div className="w-32 md:w-40 p-3 bg-card rounded-xl border border-amber-500/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <WandIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium">Prompt</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Produto em fundo clean...
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="w-8 md:w-16 h-0.5 bg-linear-to-r from-amber-500 to-purple-500 rounded-full" />

                  {/* Node Preview 2 */}
                  <div className="w-32 md:w-40 p-3 bg-card rounded-xl border border-purple-500/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <SparklesIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium">Gerador AI</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Formato: 1:1 Story
                    </div>
                  </div>

                  {/* Connection Line */}
                  <div className="w-8 md:w-16 h-0.5 bg-linear-to-r from-purple-500 to-green-500 rounded-full" />

                  {/* Node Preview 3 */}
                  <div className="w-32 md:w-40 p-3 bg-card rounded-xl border border-green-500/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <ImageIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium">Criativo</span>
                    </div>
                    <div className="w-full h-12 bg-linear-to-br from-purple-200 to-blue-200 dark:from-purple-900 dark:to-blue-900 rounded-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Criativos para{" "}
              <span className="text-purple-600">Qualquer Campanha</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Do Instagram ao e-commerce, crie peças que convertem para qualquer
              plataforma
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="p-6 rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-all hover:shadow-lg group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${useCase.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <useCase.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Tudo que você precisa para{" "}
                <span className="bg-linear-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                  criar rápido
                </span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Interface visual intuitiva que permite criar criativos
                profissionais sem conhecimento técnico. Conecte, configure e
                gere.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                      <CheckIcon className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
              <div className="relative p-8 rounded-2xl bg-card border border-border">
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-600 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Descreva sua ideia</h4>
                      <p className="text-sm text-muted-foreground">
                        Escreva o que você quer criar em linguagem natural
                      </p>
                    </div>
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 text-purple-600 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Configure o formato</h4>
                      <p className="text-sm text-muted-foreground">
                        Escolha proporção, qualidade e referências
                      </p>
                    </div>
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 text-green-600 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Gere e exporte</h4>
                      <p className="text-sm text-muted-foreground">
                        Clique e receba seu criativo pronto para usar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 to-blue-500/10" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 text-sm font-medium mb-6">
            <ZapIcon className="w-4 h-4" />
            <span>Comece gratuitamente</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pare de perder tempo com ferramentas complicadas
          </h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Crie criativos profissionais para suas campanhas em minutos, não em
            horas. Sem curva de aprendizado, sem mensalidades caras.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              className="bg-linear-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:scale-105"
            >
              <SparklesIcon className="w-5 h-5 mr-2" />
              Criar Meu Primeiro Criativo
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>
            Feito com{" "}
            <span className="text-purple-500">
              <SparklesIcon className="w-4 h-4 inline" />
            </span>{" "}
            por Orion Flow
          </p>
        </div>
      </footer>
    </div>
  );
}
