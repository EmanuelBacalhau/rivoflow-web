"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { DownloadIcon, EyeIcon, ShareIcon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Button } from "../ui/button";

interface ResultNodeData {
  imageUrl?: string;
}

export function ResultImageNode({ data }: NodeProps) {
  const nodeData = data as ResultNodeData;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!nodeData.imageUrl) return;

    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = nodeData.imageUrl;
      link.download = `orion-flow-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  }, [nodeData.imageUrl]);

  const handleShare = useCallback(async () => {
    if (!nodeData.imageUrl) return;

    try {
      const blob = await fetch(nodeData.imageUrl).then((r) => r.blob());
      const file = new File([blob], "orion-flow-image.png", {
        type: "image/png",
      });
      await navigator.share({ files: [file] });
    } catch {
      await navigator.clipboard.writeText(nodeData.imageUrl);
    }
  }, [nodeData.imageUrl]);

  return (
    <div className="w-72 rounded-xl border border-green-200 bg-white shadow-md overflow-hidden">
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
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-linear-to-r from-green-50 to-emerald-50 border-b border-green-100">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm shrink-0">
          <EyeIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 leading-tight">
            Resultado
          </h3>
          <p className="text-[10px] text-green-600/80">Imagem gerada</p>
        </div>
        {nodeData.imageUrl && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 shrink-0">
            Pronto
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3">
        {nodeData.imageUrl ? (
          <div className="space-y-2">
            <div className="w-full h-48 overflow-hidden rounded-lg relative group border border-green-100">
              <Image
                src={nodeData.imageUrl}
                alt="Generated Result"
                fill
                sizes="288px"
                quality={100}
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => window.open(nodeData.imageUrl, "_blank")}
                >
                  <ZoomInIcon className="size-5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={handleDownload}
                disabled={downloading}
              >
                <DownloadIcon className="size-3.5 mr-1.5" />
                {downloading ? "Baixando..." : "Baixar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={handleShare}
              >
                <ShareIcon className="size-3.5" />
              </Button>
            </div>

            <p className="text-[10px] text-center text-gray-400">
              Conecte a outro gerador
            </p>
          </div>
        ) : (
          <div className="h-20 flex items-center justify-center rounded-lg border border-dashed border-green-200 bg-green-50/50">
            <p className="text-[10px] text-gray-400">Aguardando geração...</p>
          </div>
        )}
      </div>
    </div>
  );
}
