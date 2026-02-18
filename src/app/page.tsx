"use client";

import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  ImageIcon,
  LayersIcon,
  LayoutGridIcon,
  MenuIcon,
  MinusIcon,
  PlayCircleIcon,
  PlusIcon,
  RocketIcon,
  Settings2Icon,
  ShoppingBagIcon,
  SparklesIcon,
  StarIcon,
  VideoIcon,
  WandIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Produto", href: "#features" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Preços", href: "#pricing" },
];

const metrics = [
  { value: "10K+", label: "Criativos gerados" },
  { value: "500+", label: "Times ativos" },
  { value: "4.9★", label: "Avaliação média" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  {
    id: "flow",
    title: "Editor Visual de Fluxos",
    description:
      "Monte pipelines de criação arrastando e conectando nós. Reutilize fluxos completos com um clique.",
    wide: true,
    icon: LayersIcon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    id: "speed",
    title: "Geração em Segundos",
    description:
      "IA de última geração que entrega seu criativo em instantes, sem fila.",
    wide: false,
    icon: ZapIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "formats",
    title: "Múltiplos Formatos",
    description:
      "Story, feed, banner, thumbnail — em todas as proporções que você precisar.",
    wide: false,
    icon: LayoutGridIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    id: "references",
    title: "Referências Visuais",
    description:
      "Envie imagens de referência para guiar a geração com precisão e consistência de marca.",
    wide: false,
    icon: ImageIcon,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    id: "quality",
    title: "Exportação em Alta Qualidade",
    description:
      "Arquivos prontos para publicar em qualquer plataforma, resolução até 4K.",
    wide: true,
    icon: Settings2Icon,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
];

const steps = [
  {
    title: "Descreva sua ideia",
    description:
      "Escreva o que você quer criar em linguagem natural. Seja específico ou deixe a IA interpretar.",
    icon: WandIcon,
    time: "~10s",
  },
  {
    title: "Configure o formato",
    description:
      "Escolha a proporção, qualidade e adicione referências visuais para guiar a geração.",
    icon: Settings2Icon,
    time: "~20s",
  },
  {
    title: "Gere e exporte",
    description: "Um clique. Criativo em alta qualidade pronto para publicar.",
    icon: RocketIcon,
    time: "~30s",
  },
];

const testimonials = [
  {
    name: "Camila Torres",
    role: "Gestora de Marketing",
    company: "HealthBrand",
    quote:
      "Reduzi o tempo de produção de criativos em 80%. O que levava 2 dias, agora faço em 30 minutos.",
    stars: 5,
  },
  {
    name: "Rafael Souza",
    role: "Fundador",
    company: "Agência Criativa",
    quote:
      "Meus clientes ficaram impressionados com a qualidade. Virou parte essencial do nosso processo.",
    stars: 5,
  },
  {
    name: "Isabela Martins",
    role: "Social Media Manager",
    company: "E-commerce Fashion",
    quote:
      "A facilidade de usar referências visuais é incrível. Agora mantenho a identidade visual em tudo.",
    stars: 5,
  },
];

const pricingPlans = [
  {
    name: "Gratuito",
    price: "R$0",
    period: "/mês",
    description: "Para começar a explorar",
    features: [
      "10 criativos por mês",
      "Formatos básicos (1:1, 16:9)",
      "Qualidade até 1K",
      "Editor visual de fluxos",
    ],
    cta: "Começar grátis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "R$49",
    period: "/mês",
    description: "Para criar profissionalmente",
    features: [
      "Criativos ilimitados",
      "Todos os formatos e proporções",
      "Qualidade até 4K",
      "Referências visuais",
      "Exportação em lote",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    highlight: true,
  },
];

const faqs = [
  {
    question: "Preciso saber programar para usar?",
    answer:
      "Não. O editor é completamente visual — arraste, conecte e configure os nós sem escrever uma linha de código.",
  },
  {
    question: "Que tipos de imagem posso gerar?",
    answer:
      "Posts para redes sociais, banners, thumbnails para YouTube, imagens para e-commerce e muito mais. Você controla a proporção e o estilo.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. Sem fidelidade. Cancele pelo painel quando quiser e seu acesso continua até o fim do período pago.",
  },
  {
    question: "Como funciona o limite de criativos do plano grátis?",
    answer:
      "Você tem 10 gerações por mês. Ao atingir o limite, pode fazer upgrade para o Pro e continuar criando sem interrupções.",
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* ── Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <Image
              src="/rivoflow.png"
              alt="RIVOFLOW"
              width={36}
              height={36}
              className="rounded-xl"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/editor"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Entrar
            </Link>
            <Link href="/editor">
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Começar grátis
                <ChevronRightIcon className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted-foreground rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
            type="button"
          >
            {mobileMenuOpen ? (
              <XIcon className="w-5 h-5" />
            ) : (
              <MenuIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 bg-background px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm text-muted-foreground py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/editor">
              <Button
                size="sm"
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Começar grátis
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-12 md:pt-28 md:pb-20">
        <div className="absolute inset-0 bg-linear-to-b from-indigo-500/8 via-transparent to-transparent" />
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge — credibilidade real */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-8">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Integrado com Google Gemini 2.0</span>
          </div>

          {/* Headline — resultado claro */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            <span>Crie criativos</span>
            <br />
            <span className="bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              que vendem
            </span>
            <br />
            <span>em segundos</span>
          </h1>

          <p className="max-w-xl mx-auto text-lg text-muted-foreground leading-relaxed mb-4">
            Editor visual de fluxos com IA para times de marketing e agências
            que precisam criar mais, com mais velocidade e menos esforço.
          </p>

          {/* Social proof inline */}
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex -space-x-1.5">
              {["#6366f1", "#3b82f6", "#8b5cf6", "#06b6d4"].map((color, i) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded-full border-2 border-background"
                  style={{ backgroundColor: color, zIndex: 4 - i }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">+500 times</span>{" "}
              já escalam a produção de criativos
            </p>
          </div>

          {/* Media type tags */}
          <div className="flex items-center justify-center gap-3 mb-10 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
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
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
              >
                <RocketIcon className="w-4 h-4 mr-2" />
                Começar grátis
                <ArrowRightIcon className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-8 text-base rounded-xl border-border/60"
              type="button"
            >
              <PlayCircleIcon className="w-4 h-4 mr-2" />
              Ver demonstração
            </Button>
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

        {/* Product mockup */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 mt-16">
          <div className="relative">
            <div className="absolute -inset-3 bg-linear-to-r from-indigo-500/20 to-blue-500/20 rounded-3xl blur-2xl opacity-60" />
            <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-2xl overflow-hidden">
              {/* Browser chrome */}
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
                  {/* Prompt node */}
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

                  {/* Generation node */}
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
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[9px] text-indigo-600 font-medium">
                        Processando
                      </span>
                    </div>
                  </div>

                  <div className="w-8 md:w-12 h-0.5 bg-linear-to-r from-indigo-400 to-green-500 rounded-full" />

                  {/* Result node */}
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

      {/* ── Use Cases Strip ───────────────────────────────── */}
      <section className="py-14 border-y border-border/50 bg-muted/20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs text-muted-foreground uppercase tracking-widest mb-8">
            Ideal para qualquer tipo de campanha
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: LayoutGridIcon,
                label: "Social Media",
                color: "text-pink-500",
                bg: "bg-pink-500/8",
              },
              {
                icon: ShoppingBagIcon,
                label: "E-commerce",
                color: "text-amber-500",
                bg: "bg-amber-500/8",
              },
              {
                icon: PlayCircleIcon,
                label: "YouTube & Ads",
                color: "text-red-500",
                bg: "bg-red-500/8",
              },
              {
                icon: VideoIcon,
                label: "Apresentações",
                color: "text-blue-500",
                bg: "bg-blue-500/8",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/40 hover:border-border/60 transition-colors"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features (Bento) ──────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-3">
              Produto
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Tudo que você precisa para{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                criar rápido
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Interface que conecta sua ideia direto ao resultado. Sem idas e
              vindas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feat) => (
              <div
                key={feat.id}
                className={`${feat.wide ? "md:col-span-2" : "md:col-span-1"} p-7 rounded-2xl border border-border/50 bg-card/50 hover:border-indigo-500/30 hover:bg-card/80 transition-all group`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <h3 className="font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-3">
              Como funciona
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Do zero ao criativo em{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                menos de 1 minuto
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Sem curva de aprendizado. Sem fricção. Só resultado.
            </p>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(33.33%+8px)] right-[calc(33.33%+8px)] h-px bg-linear-to-r from-indigo-300/40 via-indigo-400/60 to-indigo-300/40" />

            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center">
                    <step.icon className="w-7 h-7 text-indigo-500" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {step.description}
                </p>
                <span className="text-[11px] font-medium text-indigo-600 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                  {step.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-3">
              Depoimentos
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Quem usa,{" "}
              <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                recomenda
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border border-border/50 bg-card/50 flex flex-col gap-4"
              >
                {/* Large decorative quote mark */}
                <span className="text-5xl font-serif leading-none text-indigo-500/25 select-none">
                  "
                </span>
                <p className="text-sm text-foreground leading-relaxed flex-1 -mt-3">
                  {t.quote}
                </p>
                <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.role} · {t.company}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }, (_, i) => (
                      <StarIcon
                        key={`star-${t.name}-${i}`}
                        className="w-3 h-3 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────── */}
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-3">
              Preços
            </p>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Simples e transparente
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Comece grátis. Faça upgrade quando precisar de mais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${
                  plan.highlight
                    ? "border-indigo-500 bg-card shadow-2xl shadow-indigo-500/10 relative"
                    : "border-border/50 bg-card/50"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[11px] font-semibold rounded-full">
                    Mais popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-5">
                    {plan.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm mb-1">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? "bg-indigo-500/20" : "bg-green-500/20"}`}
                      >
                        <CheckIcon
                          className={`w-2.5 h-2.5 ${plan.highlight ? "text-indigo-600" : "text-green-600"}`}
                        />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link href="/editor" className="block">
                  <Button
                    className={`w-full ${
                      plan.highlight
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                        : ""
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    {plan.cta}
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-widest mb-3">
              Dúvidas
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="rounded-xl border border-border/50 bg-card/50 overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-sm font-semibold pr-4">
                    {faq.question}
                  </span>
                  {openFaq === idx ? (
                    <MinusIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <PlusIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden bg-muted/20">
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-500/5 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 text-xs font-medium mb-6">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Plano gratuito disponível agora</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Comece a criar hoje.{" "}
            <span className="bg-linear-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Sem custo.
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Sua próxima campanha pode estar pronta ainda hoje. Sem cartão de
            crédito, sem burocracia.
          </p>
          <Link href="/editor">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-12 text-base rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-[1.02]"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              Criar meu primeiro criativo
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center md:items-start gap-1.5">
              <Link href="/">
                <Image
                  src="/rivoflow.png"
                  alt="RIVOFLOW"
                  width={26}
                  height={26}
                  className="rounded-md"
                />
              </Link>
              <p className="text-[11px] text-muted-foreground">
                Feito por{" "}
                <span className="font-medium text-foreground">RivoCode</span>
              </p>
            </div>

            <div className="flex items-center gap-7 text-xs text-muted-foreground">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Termos de uso
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacidade
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Suporte
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RivoFlow. Todos os direitos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
