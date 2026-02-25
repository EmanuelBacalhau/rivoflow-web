"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { DownloadIcon, EyeIcon, Trash2Icon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useFlow } from "@/contexts/flow-context";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface ResultNodeData {
  imageUrl?: string;
}

export function ResultImageNode({ id, data, selected }: NodeProps) {
  const { removeNode } = useFlow();
  const nodeData = data as ResultNodeData;
  const [downloading, setDownloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!nodeData.imageUrl) return;

    setDownloading(true);
    try {
      const response = await fetch(nodeData.imageUrl);

      if (!response.ok)
        throw new Error("Erro de rede ao tentar baixar a imagem");

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `rivo-flow-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
      toast.success("Imagem baixada com sucesso!");
    } catch (error) {
      toast.error("Erro ao baixar imagem. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }, [nodeData.imageUrl]);

  return (
    <Card
      className={`w-72 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-green-400 ring-2 ring-green-300 shadow-green-400 shadow-lg" : "border-green-200"}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="bg-green-400! size-3! border-2! border-white!"
      />
      {nodeData.imageUrl && (
        <Handle
          type="source"
          position={Position.Right}
          className="bg-green-400! size-3! border-2! border-white!"
        />
      )}

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-green-500/10 to-emerald-500/10 border-b border-green-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm shrink-0">
          <EyeIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Resultado
          </h3>
          <p className="text-[10px] text-green-500">Imagem gerada</p>
        </div>
        {nodeData.imageUrl && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 shrink-0">
            Pronto
          </span>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-green-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de resultado"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-3">
        {nodeData.imageUrl ? (
          <div className="space-y-2">
            <div className="w-full h-48 overflow-hidden rounded-lg relative group border border-green-500/20">
              <Image
                src={nodeData.imageUrl}
                alt="Generated Result"
                fill
                sizes="288px"
                quality={100}
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="cursor-pointer nodrag"
                    >
                      <ZoomInIcon className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden border-none outline-none">
                    <DialogTitle className="sr-only">
                      Visualização da imagem gerada
                    </DialogTitle>
                    <div className="relative w-full h-[80vh] bg-black/5 rounded-lg border border-border">
                      <Image
                        src={nodeData.imageUrl}
                        alt="Visualização da imagem gerada"
                        fill
                        sizes="(max-width: 896px) 100vw, 896px"
                        quality={100}
                        className="object-contain"
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

            <p className="text-[10px] text-center text-muted-foreground">
              Conecte a outro gerador
            </p>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-green-500/30 bg-green-500/10">
            <p className="text-[10px] text-muted-foreground">
              Aguardando geração...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
