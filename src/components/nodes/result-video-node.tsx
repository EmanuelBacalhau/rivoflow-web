"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  DownloadIcon,
  PlayCircleIcon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useFlow } from "@/contexts/flow-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ResultVideoNodeData {
  videoUrl?: string;
  duration?: number;
  fps?: number;
}

export function ResultVideoNode({ id, data, selected }: NodeProps) {
  const { removeNode } = useFlow();
  const nodeData = data as ResultVideoNodeData;
  const [downloading, setDownloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleDownload = useCallback(async () => {
    if (!nodeData.videoUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(nodeData.videoUrl);
      if (!response.ok)
        throw new Error("Erro de rede ao tentar baixar o vídeo");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `rivo-flow-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
      if (isMobile) {
        toast.success("Vídeo baixado com sucesso!");
      }
    } catch {
      toast.error("Erro ao baixar vídeo. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }, [nodeData.videoUrl, isMobile]);

  return (
    <Card
      className={`w-72 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-emerald-400 ring-2 ring-emerald-300 shadow-emerald-400 shadow-lg" : "border-emerald-200"}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="bg-emerald-400! size-3! border-2! border-white!"
      />
      {nodeData.videoUrl && (
        <Handle
          type="source"
          position={Position.Right}
          className="bg-emerald-400! size-3! border-2! border-white!"
        />
      )}

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-emerald-500/10 to-green-500/10 border-b border-emerald-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shrink-0">
          <VideoIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Resultado
          </h3>
          <p className="text-[10px] text-emerald-500">Vídeo gerado</p>
        </div>
        {nodeData.videoUrl && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 shrink-0">
            Pronto
          </span>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-emerald-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de resultado de vídeo"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-3">
        {nodeData.videoUrl ? (
          <div className="space-y-2">
            <div className="w-full h-48 overflow-hidden rounded-lg relative group border border-emerald-500/20 bg-black">
              <video
                src={nodeData.videoUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="cursor-pointer nodrag"
                      aria-label="Reproduzir vídeo em tela cheia"
                    >
                      <PlayCircleIcon className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden border-none outline-none">
                    <DialogTitle className="sr-only">
                      Visualização do vídeo gerado
                    </DialogTitle>
                    <div className="relative w-full bg-black rounded-lg">
                      {/* biome-ignore lint/a11y/useMediaCaption: generated video has no captions */}
                      <video
                        src={nodeData.videoUrl}
                        className="w-full max-h-[80vh]"
                        controls
                        autoPlay
                        playsInline
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs nodrag"
                onClick={handleDownload}
                disabled={downloading}
              >
                <DownloadIcon className="size-3.5 mr-1.5" />
                {downloading ? "Baixando..." : "Baixar"}
              </Button>
            </div>

            {nodeData.duration && (
              <p className="text-[10px] text-center text-muted-foreground">
                Duração: {nodeData.duration.toFixed(1)}s
              </p>
            )}
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-emerald-500/30 bg-emerald-500/10">
            <p className="text-[10px] text-muted-foreground">
              Aguardando geração...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
