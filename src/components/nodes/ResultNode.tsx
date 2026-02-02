"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  DownloadIcon,
  EyeIcon,
  ShareIcon,
  ZoomInIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface ResultNodeData {
  imageUrl?: string;
}

export function ResultNode({ data }: NodeProps) {
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
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(nodeData.imageUrl);
    }
  }, [nodeData.imageUrl]);

  return (
    <Card className="w-72 p-1 shadow-lg border-green-200 bg-linear-to-b from-white to-green-50/30">
      <Handle
        type="target"
        position={Position.Left}
        className="bg-green-400! size-3! border-2! border-white!"
      />
      {/* Handle source para fluxo incremental */}
      {nodeData.imageUrl && (
        <Handle
          type="source"
          position={Position.Right}
          className="bg-green-400! size-3! border-2! border-white!"
        />
      )}

      <CardContent className="p-3 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-green-400 to-green-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <EyeIcon className="size-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-sm">Resultado</h3>
            <span className="text-xs text-gray-500">Imagem gerada</span>
          </div>

          {nodeData.imageUrl && (
            <Badge
              variant="secondary"
              className="text-[10px] bg-green-100 text-green-700"
            >
              Pronto
            </Badge>
          )}
        </header>

        {nodeData.imageUrl ? (
          <div className="space-y-2">
            <div className="w-full h-48 overflow-hidden rounded-lg relative group border border-green-100">
              <Image
                src={nodeData.imageUrl}
                alt="Generated Result"
                fill
                className="object-cover"
                quality={100}
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-9 nodrag"
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
                className="flex-1 h-8 text-xs nodrag"
                onClick={handleDownload}
                disabled={downloading}
              >
                <DownloadIcon className="size-3.5 mr-1.5" />
                {downloading ? "Baixando..." : "Baixar"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs nodrag"
                onClick={handleShare}
              >
                <ShareIcon className="size-3.5" />
              </Button>
            </div>

            {/* Indicador de fluxo */}
            <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1">
              <ArrowRightIcon className="size-3" />
              Conecte a outro gerador
            </p>
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center">
            <div className="bg-gray-100 rounded-full p-3 mb-2">
              <EyeIcon className="size-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">Aguardando imagem...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
