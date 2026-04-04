"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  CheckIcon,
  ImagePlusIcon,
  Loader2Icon,
  Trash2Icon,
  UploadCloudIcon,
  ZoomInIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useFlow } from "@/contexts/flow-context";
import type { FileNodeService } from "@/services/node/file-node-service";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

type UploadImageNodeData = FileNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function UploadImageNode({ id, data, selected }: NodeProps) {
  const {
    uploadImageNode,
    flowId,
    markConnectedGeneratorsAsCalculating,
    removeNode,
  } = useFlow();
  const nodeData = data as UploadImageNodeData;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputId = `input-file-${id}`;

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande. Máximo 10MB.");
      return;
    }

    setIsUploading(true);
    try {
      markConnectedGeneratorsAsCalculating(id);
      await uploadImageNode({
        flowId,
        nodeId: id,
        file: selectedFile,
      });
    } catch {
      toast.error("Erro ao enviar imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card
      className={`w-64 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-blue-400 ring-2 ring-blue-300 shadow-blue-400 shadow-lg" : "border-blue-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-blue-400! size-3! border-2! border-white!"
      />

      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-blue-500/10 to-sky-500/10 border-b border-blue-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm shrink-0">
          <ImagePlusIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Imagem
          </h3>
          <p className="text-[10px] text-blue-500">Produto ou referência</p>
        </div>
        {nodeData.isExecuted && (
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CheckIcon className="size-3 text-green-600" />
          </div>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-blue-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de imagem"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-3">
        {nodeData.imageUrl ? (
          <div className="w-full h-40 overflow-hidden rounded-lg relative group border border-blue-500/20">
            <Image
              src={nodeData.imageUrl}
              alt="Imagem de referência enviada"
              fill
              sizes="256px"
              quality={100}
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="cursor-pointer nodrag"
                    aria-label="Ampliar imagem"
                  >
                    <ZoomInIcon className="size-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden">
                  <DialogTitle className="sr-only">
                    Visualização da imagem
                  </DialogTitle>
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={nodeData.imageUrl}
                      alt="Visualização da imagem"
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
        ) : (
          <label htmlFor={inputId} className="block nodrag nopan">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              id={inputId}
              disabled={isUploading}
            />
            <div className="cursor-pointer text-center border-2 border-dashed border-blue-500/30 rounded-lg p-5 hover:border-blue-400 hover:bg-blue-500/10 transition-all group">
              <div className="bg-blue-500/20 rounded-full p-2.5 mx-auto mb-2.5 w-fit group-hover:bg-blue-500/30 transition-colors">
                {isUploading ? (
                  <Loader2Icon className="size-5 text-blue-500 animate-spin" />
                ) : (
                  <UploadCloudIcon className="size-5 text-blue-500" />
                )}
              </div>
              <p className="text-xs font-medium text-card-foreground mb-0.5">
                {isUploading ? "Enviando..." : "Clique para carregar"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                JPG, PNG ou WebP (máx. 10MB)
              </p>
            </div>
          </label>
        )}
      </CardContent>
    </Card>
  );
}
