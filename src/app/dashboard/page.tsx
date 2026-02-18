"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CheckIcon,
  CreditCardIcon,
  ImageIcon,
  LayersIcon,
  PlusIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FlowService } from "@/services/FlowService";

const STATS = [
  {
    label: "Flows criados",
    value: "3",
    icon: LayersIcon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    label: "Imagens geradas",
    value: "24",
    icon: ImageIcon,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Créditos restantes",
    value: "76 / 100",
    icon: ZapIcon,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Gerado hoje",
    value: "5",
    icon: SparklesIcon,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

const MOCK_FLOWS = [
  {
    id: "mock-1",
    title: "Campanha Verão 2025",
    updatedAt: "2025-02-17T14:30:00Z",
    images: 8,
  },
  {
    id: "mock-2",
    title: "Produto Destaque - Tênis",
    updatedAt: "2025-02-16T09:15:00Z",
    images: 5,
  },
  {
    id: "mock-3",
    title: "Stories Instagram - Promo",
    updatedAt: "2025-02-14T18:00:00Z",
    images: 11,
  },
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `${days} dias atrás`;
}

export default function DashboardPage() {
  const router = useRouter();

  const { mutate: createFlow, isPending } = useMutation({
    mutationFn: () => FlowService.create("Novo Flow"),
    onSuccess: ({ flow }) => {
      router.push(`/dashboard/flow/${flow.id}`);
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Bem-vindo de volta. Aqui está o resumo da sua conta.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => createFlow()}
          disabled={isPending}
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          {isPending ? "Criando..." : "Novo Flow"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border/50 bg-card p-5 flex flex-col gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
            >
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent flows */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-base font-semibold">Flows recentes</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {MOCK_FLOWS.map((flow) => (
          <button
            key={flow.id}
            type="button"
            className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-indigo-500/40 hover:shadow-md transition-all text-left w-full"
            onClick={() => createFlow()}
          >
            {/* Thumbnail placeholder */}
            <div className="h-36 bg-gradient-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 flex items-center justify-center border-b border-border/30">
              <LayersIcon className="w-8 h-8 text-indigo-500/40" />
            </div>
            <div className="p-4">
              <p className="text-sm font-medium truncate">{flow.title}</p>
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-muted-foreground">
                  {timeAgo(flow.updatedAt)}
                </p>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ImageIcon className="w-3 h-3" />
                  {flow.images}
                </span>
              </div>
            </div>
          </button>
        ))}

        {/* New flow card */}
        <button
          type="button"
          onClick={() => createFlow()}
          disabled={isPending}
          className="rounded-xl border border-dashed border-border/60 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-2 h-[168px] text-muted-foreground hover:text-indigo-500"
        >
          <PlusIcon className="w-6 h-6" />
          <span className="text-sm font-medium">Novo Flow</span>
        </button>
      </div>

      {/* Quick actions */}
      <div className="mt-10 rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-base font-semibold mb-4">Ações rápidas</h2>
        <div className="grid md:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => createFlow()}
            disabled={isPending}
            className="flex items-center gap-3 p-4 rounded-lg border border-border/40 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
              <LayersIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Criar novo flow</p>
              <p className="text-xs text-muted-foreground">
                Monte um pipeline de geração do zero
              </p>
            </div>
            <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 transition-colors shrink-0" />
          </button>

          <button
            type="button"
            disabled
            className="flex items-center gap-3 p-4 rounded-lg border border-border/40 opacity-50 cursor-not-allowed text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
              <ImageIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Ver galeria</p>
              <p className="text-xs text-muted-foreground">
                Todas as imagens geradas
              </p>
            </div>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded shrink-0">
              Em breve
            </span>
          </button>
        </div>
      </div>

      {/* Credits recharge */}
      <div className="mt-6 rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-base font-semibold">Créditos</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plano gratuito · 76 créditos restantes
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition-colors"
          >
            <CreditCardIcon className="w-3.5 h-3.5" />
            Recarregar
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usado este mês</span>
            <span className="font-medium">24 / 100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
              style={{ width: "24%" }}
            />
          </div>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/30">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ZapIcon className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Gratuito</p>
              <p className="text-xs text-muted-foreground">100 créditos/mês</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-green-600 font-medium">
                <CheckIcon className="w-3 h-3" />
                Plano atual
              </span>
            </div>
          </div>
          <button
            type="button"
            className="flex items-start gap-3 p-3 rounded-lg border border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center shrink-0">
              <SparklesIcon className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Pro</p>
              <p className="text-xs text-muted-foreground">
                Créditos ilimitados · R$49/mês
              </p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-indigo-600 font-medium group-hover:underline">
                Fazer upgrade
                <ArrowRightIcon className="w-3 h-3" />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
