"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  CheckIcon,
  PlayCircleIcon,
  Trash2Icon,
  VideotapeIcon,
} from "lucide-react";
import { useState } from "react";
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

type UploadVideoNodeData = {
  key: string | null;
  duration?: number;
  videoUrl?: string;
  isExecuted?: boolean;
};

export function UploadVideoNode({ id, data, selected }: NodeProps) {
  const {
    uploadImageNode,
    flowId,
    markConnectedGeneratorsAsCalculating,
    removeNode,
  } = useFlow();
  const nodeData = data as UploadVideoNodeData;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const inputId = `input-video-${id}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "video/mp4") {
      toast.error("Formato inválido. Apenas arquivos MP4 são permitidos.");
      return;
    }

    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Arquivo muito grande. Máximo 100MB.");
      return;
    }

    markConnectedGeneratorsAsCalculating(id);
    uploadImageNode({
      flowId,
      nodeId: id,
      file: selectedFile,
    });
  };

  return (
    <Card
      className={`w-64 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-violet-400 ring-2 ring-violet-300 shadow-violet-400 shadow-lg" : "border-violet-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-violet-400! size-3! border-2! border-white!"
      />

      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-violet-500/10 to-purple-500/10 border-b border-violet-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-sm shrink-0">
          <VideotapeIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Vídeo
          </h3>
          <p className="text-[10px] text-violet-500">Referência de movimento</p>
        </div>
        {nodeData.isExecuted && (
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CheckIcon className="size-3 text-green-600" />
          </div>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-violet-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de vídeo"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-3">
        {nodeData.videoUrl ? (
          <div className="w-full h-40 overflow-hidden rounded-lg relative group border border-violet-500/20 bg-black">
            {!isVideoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
                <VideotapeIcon className="size-5 text-muted-foreground/30" />
              </div>
            )}
            <video
              src={nodeData.videoUrl}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? "opacity-100" : "opacity-0"}`}
              muted
              loop
              autoPlay
              playsInline
              onLoadedData={() => setIsVideoLoaded(true)}
            />
            {isVideoLoaded && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="cursor-pointer nodrag"
                      aria-label="Reproduzir vídeo em tela cheia"
                    >
                      <PlayCircleIcon className="size-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl p-0 overflow-hidden border-none outline-none">
                    <DialogTitle className="sr-only">
                      Visualização do vídeo
                    </DialogTitle>
                    <div className="relative w-full bg-black rounded-lg">
                      {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded video has no captions */}
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
            )}
          </div>
        ) : (
          <label htmlFor={inputId} className="block nodrag nopan">
            <input
              type="file"
              accept="video/mp4"
              className="hidden"
              onChange={handleFileChange}
              id={inputId}
            />
            <div className="cursor-pointer text-center border-2 border-dashed border-violet-500/30 rounded-lg p-5 hover:border-violet-400 hover:bg-violet-500/10 transition-all group relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-violet-500/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="bg-violet-500/20 rounded-full p-3 mx-auto mb-2.5 w-fit group-hover:bg-violet-500/30 transition-colors">
                  <PlayCircleIcon className="size-6 text-violet-500" />
                </div>
                <p className="text-xs font-medium text-card-foreground mb-0.5">
                  Carregar vídeo
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Apenas MP4 • Máx 100MB
                </p>
              </div>
            </div>
          </label>
        )}
      </CardContent>
    </Card>
  );
}
