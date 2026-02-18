"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRightIcon,
  CheckIcon,
  CreditCardIcon,
  FolderIcon,
  ImageIcon,
  PlusIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { Button } from "@/components/ui/button";
import { ProjectService } from "@/services/ProjectService";

const MOCK_PROJECTS: ProjectService.Project[] = [
  {
    id: "mock-1",
    name: "Campanha Verão 2025",
    createdAt: "2025-02-10T10:00:00Z",
    updatedAt: "2025-02-17T14:30:00Z",
  },
  {
    id: "mock-2",
    name: "Produto Destaque - Tênis",
    createdAt: "2025-02-12T09:00:00Z",
    updatedAt: "2025-02-16T09:15:00Z",
  },
  {
    id: "mock-3",
    name: "Stories Instagram - Promo",
    createdAt: "2025-02-14T08:00:00Z",
    updatedAt: "2025-02-14T18:00:00Z",
  },
];

const STATS = [
  {
    label: "Projetos",
    icon: FolderIcon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    dynamic: true,
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

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `${days} dias atrás`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: ProjectService.getAll,
    placeholderData: { projects: MOCK_PROJECTS },
  });

  const projects = data?.projects ?? [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <CreateProjectDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Organize seus flows em projetos.
          </p>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsCreateOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          Novo Projeto
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
              <p className="text-2xl font-bold">
                {"dynamic" in stat ? String(projects.length) : stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      <div className="mb-6">
        <h2 className="text-base font-semibold">Seus Projetos</h2>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-40 rounded-xl border border-border/50 bg-card animate-pulse"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
          <FolderIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Nenhum projeto ainda. Crie um para começar.
          </p>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsCreateOpen(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Criar primeiro projeto
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <button
              key={project.id}
              type="button"
              className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-indigo-500/40 hover:shadow-md transition-all text-left w-full"
              onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <div className="h-28 bg-linear-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 flex items-center justify-center border-b border-border/30">
                <FolderIcon className="w-8 h-8 text-indigo-500/40 group-hover:text-indigo-500/60 transition-colors" />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate">{project.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(project.updatedAt)}
                </p>
              </div>
            </button>
          ))}

          {/* New project card */}
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl border border-dashed border-border/60 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-2 h-42 text-muted-foreground hover:text-indigo-500"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Novo Projeto</span>
          </button>
        </div>
      )}

      {/* Credits recharge */}
      <div className="mt-10 rounded-xl border border-border/50 bg-card p-6">
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

        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Usado este mês</span>
            <span className="font-medium">24 / 100</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-blue-500 transition-all"
              style={{ width: "24%" }}
            />
          </div>
        </div>

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
