"use client";

import {
  CloudIcon,
  ImageIcon,
  LayersIcon,
  LayoutGridIcon,
  Settings2Icon,
  WandIcon,
  ZapIcon,
} from "lucide-react";
import { LandingFaq } from "@/components/landing/faq";
import { LandingFeatures } from "@/components/landing/features";
import { LandingFinalCta } from "@/components/landing/final-cta";
import { LandingFooter } from "@/components/landing/footer";
import { LandingHero } from "@/components/landing/hero";
import { LandingHowItWorks } from "@/components/landing/how-it-works";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingPricing } from "@/components/landing/pricing";
import { LandingTestimonials } from "@/components/landing/testimonials";
import { LandingUseCases } from "@/components/landing/use-cases";

const navLinks = [
  { label: "Produto", href: "#features" },
  { label: "Como funciona", href: "#how-it-works" },
  { label: "Preços", href: "#pricing" },
];

const features = [
  {
    id: "flow",
    title: "Editor Visual de Fluxos",
    description:
      "Monte pipelines de criação arrastando e conectando nós. Reutilize fluxos completos com um clique.",
    wide: true,
    icon: LayersIcon,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  {
    id: "speed",
    title: "Geração Imediata",
    description: "IA de última geração que entrega seu criativo em instantes.",
    wide: false,
    icon: ZapIcon,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    id: "formats",
    title: "Múltiplos Formatos",
    description:
      "Story, feed, banner, thumbnail — em todas as proporções que você precisar.",
    wide: false,
    icon: LayoutGridIcon,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: "references",
    title: "Referências Visuais",
    description:
      "Envie imagens de referência para guiar a geração com precisão. O resultado mantém a consistência da sua marca e identidade visual.",
    wide: true,
    icon: ImageIcon,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    id: "history",
    title: "Histórico Seguro na Nuvem",
    description:
      "Todas as suas gerações ficam salvas automaticamente. Acesse, baixe ou reutilize seus melhores resultados a qualquer momento no seu painel.",
    wide: true,
    icon: CloudIcon,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: "quality",
    title: "Exportação 4K",
    description:
      "Arquivos em altíssima resolução, totalmente prontos para publicações.",
    wide: false,
    icon: Settings2Icon,
    color: "text-pink-400",
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
    icon: LayersIcon,
    time: "~1 min",
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
    name: "Pay-as-you-go",
    price: "R$ 20",
    period: "depósito mínimo",
    description: "Sem assinaturas. Recarregue e use quando precisar.",
    features: [
      "Acesso completo a todos os recursos",
      "Formatos, proporções e qualidade 4K liberados",
      "Créditos só são descontados se a IA gerar com sucesso",
      "Editor visual de fluxos sem limites",
    ],
    cta: "Começar e recarregar",
    highlight: true,
    disabled: false,
  },
  {
    name: "Planos Mensais",
    price: "Em breve",
    period: "",
    description: "Para times com alto volume contínuo de produção.",
    features: [
      "Desconto na compra de lotes de créditos",
      "Recursos premium exclusivos para assinantes",
      "Acesso antecipado a novos modelos de IA",
      "Suporte prioritário e onboarding",
    ],
    cta: "Aguarde as novidades",
    highlight: false,
    disabled: true,
  },
];

const faqs = [
  {
    question: "Preciso saber programar para usar?",
    answer:
      "Não. O editor é completamente visual — arraste, conecte e configure os nós sem escrever uma linha de código.",
  },
  {
    question: "Como funcionam os pagamentos?",
    answer:
      "Trabalhamos com um sistema de recargas (Pay-as-you-go). Você faz um depósito mínimo de R$20 e ganha créditos para usar na plataforma. Sem cobranças supresas ou assinaturas escondidas.",
  },
  {
    question: "Os créditos possuem prazo de validade?",
    answer:
      "Não! Seus créditos não expiram. Eles ficam guardados na sua conta para você utilizar no seu próprio ritmo, seja hoje ou daqui a 6 meses.",
  },
  {
    question: "Vocês terão planos de assinatura no futuro?",
    answer:
      "Sim. Em breve lançaremos pacotes mensais desenhados especialmente para times e agências de alta demanda, que oferecerão descontos e ferramentas extras.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar navLinks={navLinks} />
      <LandingHero />
      <LandingUseCases />
      <LandingFeatures features={features} />
      <LandingHowItWorks steps={steps} />
      <LandingTestimonials testimonials={testimonials} />
      <LandingPricing plans={pricingPlans} />
      <LandingFaq faqs={faqs} />
      <LandingFinalCta />
      <LandingFooter />
    </div>
  );
}
