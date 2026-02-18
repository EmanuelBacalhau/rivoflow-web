"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, LayersIcon, PlusIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FlowService } from "@/services/FlowService";
import { ProjectService } from "@/services/ProjectService";

function CreateFlowDialog({
  open,
  onOpenChange,
  projectId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      FlowService.create(title.trim() || "Novo Flow", projectId),
    onSuccess: ({ flow }) => {
      onOpenChange(false);
      setTitle("");
      router.push(`/dashboard/flow/${flow.id}`);
    },
  });

  const handleOpenChange = (value: boolean) => {
    if (!value) setTitle("");
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogTitle>Novo Flow</DialogTitle>
        <DialogDescription>
          Dê um nome ao seu flow de geração de imagens.
        </DialogDescription>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Ex: Campanha Verão 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isPending && mutate()}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => mutate()}
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar Flow"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `${days} dias atrás`;
}

export default function ProjectPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);

  const { data: projectData } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => ProjectService.get(projectId),
  });

  const { data: flowsData, isLoading } = useQuery({
    queryKey: ["flows", projectId],
    queryFn: () => FlowService.getByProject(projectId),
  });

  const project = projectData?.project;
  const flows = flowsData?.flows ?? [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <CreateFlowDialog
        open={isCreateFlowOpen}
        onOpenChange={setIsCreateFlowOpen}
        projectId={projectId}
      />

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-0.5">
            <span>Dashboard</span>
            <span>/</span>
            <span>Projetos</span>
          </div>
          <h1 className="text-2xl font-bold">{project?.name ?? "Projeto"}</h1>
        </div>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => setIsCreateFlowOpen(true)}
        >
          <PlusIcon className="w-4 h-4 mr-1.5" />
          Novo Flow
        </Button>
      </div>

      {/* Flows */}
      <div className="mb-6">
        <h2 className="text-base font-semibold">Flows</h2>
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
      ) : flows.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border/60">
          <LayersIcon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground mb-4">
            Nenhum flow neste projeto ainda.
          </p>
          <Button
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => setIsCreateFlowOpen(true)}
          >
            <PlusIcon className="w-4 h-4 mr-1.5" />
            Criar primeiro flow
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {flows.map((flow) => (
            <button
              key={flow.id}
              type="button"
              className="group rounded-xl border border-border/50 bg-card overflow-hidden hover:border-indigo-500/40 hover:shadow-md transition-all text-left w-full"
              onClick={() => router.push(`/dashboard/flow/${flow.id}`)}
            >
              <div className="h-28 bg-linear-to-br from-indigo-500/10 via-blue-500/10 to-purple-500/10 flex items-center justify-center border-b border-border/30">
                <LayersIcon className="w-8 h-8 text-indigo-500/40 group-hover:text-indigo-500/60 transition-colors" />
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate">{flow.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {timeAgo(flow.updatedAt)}
                </p>
              </div>
            </button>
          ))}

          {/* New flow card */}
          <button
            type="button"
            onClick={() => setIsCreateFlowOpen(true)}
            className="rounded-xl border border-dashed border-border/60 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-2 h-42 text-muted-foreground hover:text-indigo-500"
          >
            <PlusIcon className="w-6 h-6" />
            <span className="text-sm font-medium">Novo Flow</span>
          </button>
        </div>
      )}
    </div>
  );
}
