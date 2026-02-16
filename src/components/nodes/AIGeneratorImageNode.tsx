"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  Loader2Icon,
  SparklesIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFlow } from "@/contexts/flow";
import type { AspectRatio, ImageSize } from "@/lib/google-ai";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";

type AIGeneratorNodeData = GenerationImageNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function AIGeneratorNode({ id, data }: NodeProps) {
  const {
    updateNodeData,
    getConnectedData,
    flowId,
    updateGenerationImageNode,
    generateImageNode,
  } = useFlow();
  const nodeData = data as AIGeneratorNodeData;

  const [error, setError] = useState<string | null>(null);

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const handleFormatChange = (value: string) => {
    updateNodeData(id, { format: value as AspectRatio });
    updateGenerationImageNode({
      flowId,
      nodeId: id,
      data: {
        ...nodeData,
        parameters: {
          quality: nodeData.parameters.quality ?? "1K",
          aspectRatio: value as AspectRatio,
        },
      },
    });
  };

  const handleQualityChange = (value: string) => {
    updateNodeData(id, { quality: value as ImageSize });
    updateGenerationImageNode({
      flowId,
      nodeId: id,
      data: {
        ...nodeData,
        parameters: {
          aspectRatio: nodeData.parameters.aspectRatio ?? "1:1",
          quality: value as ImageSize,
        },
      },
    });
  };

  const handleGenerateImage = async () => {
    await generateImageNode({
      flowId,
      nodeGeneratorId: id,
      inputs: connectedData.nodesSynced,
    });
  };

  const hasPrompts = connectedData.prompts.length > 0;
  const hasImages = connectedData.images.length > 0;
  const hasAnyInput = hasPrompts || hasImages;

  const isProcessing =
    nodeData.status ===
      GenerationImageNodeService.GenerationStatusEnum.PROCESSING ||
    nodeData.status === GenerationImageNodeService.GenerationStatusEnum.QUEUED;

  const isCompleted =
    nodeData.status ===
    GenerationImageNodeService.GenerationStatusEnum.COMPLETED;

  const isButtonDisabled =
    false || !hasPrompts || nodeData.isExecuted || isProcessing || isCompleted;

  return (
    <Card className="w-78 p-0 shadow-lg border-purple-600/30 bg-linear-to-b from-card to-purple-600/5">
      <Handle
        type="source"
        position={Position.Right}
        className="bg-purple-600! size-3! border-2! border-card!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-purple-600! size-3! border-2! border-card!"
      />

      <CardContent className="p-2 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-purple-400 to-purple-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <SparklesIcon className="size-4 text-white" strokeWidth={2} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">Gerador AI</h3>
            <p className="text-xs text-muted-foreground truncate">
              Gere imagens com IA
            </p>
          </div>

          {hasAnyInput && (
            <div className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {hasPrompts && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-amber-500/20 text-amber-400 rounded-full size-6"
                  >
                    {connectedData.prompts.length}
                  </Badge>
                )}
                {hasImages && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-sky-500/20 text-sky-400 rounded-full size-6"
                  >
                    {connectedData.images.length}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </header>

        {!hasAnyInput && (
          <div className="p-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-[10px] text-gray-500">
              Conecte <span className="text-amber-600">Prompt</span> ou{" "}
              <span className="text-blue-600">Imagem</span>
            </p>
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-gray-500">
              Formato
            </span>
            <Select
              value={nodeData.parameters.aspectRatio}
              onValueChange={handleFormatChange}
            >
              <SelectTrigger className="w-full nodrag h-8 text-xs">
                <SelectValue placeholder="1:1" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[10px]">Proporção</SelectLabel>
                  <SelectItem value="9:16">
                    <span className="text-xs">9:16 Story</span>
                  </SelectItem>
                  <SelectItem value="1:1">
                    <span className="text-xs">1:1 Quadrado</span>
                  </SelectItem>
                  <SelectItem value="16:9">
                    <span className="text-xs">16:9 Paisagem</span>
                  </SelectItem>
                  <SelectItem value="4:3">
                    <span className="text-xs">4:3 Post</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-medium text-gray-500">
              Qualidade
            </span>
            <Select
              value={nodeData.parameters.quality}
              onValueChange={handleQualityChange}
            >
              <SelectTrigger className="w-full nodrag h-8 text-xs">
                <SelectValue placeholder="1K" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-[10px]">Resolução</SelectLabel>
                  <SelectItem value="1K">
                    <div className="flex items-center gap-1.5">
                      <ZapIcon className="size-3 text-gray-400" />
                      <span className="text-xs">1K Rápido</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="2K">
                    <div className="flex items-center gap-1.5">
                      <ZapIcon className="size-3 text-amber-500" />
                      <span className="text-xs">2K Padrão</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="4K">
                    <div className="flex items-center gap-1.5">
                      <ZapIcon className="size-3 text-purple-500" />
                      <span className="text-xs">4K Alta</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-200 rounded-lg">
            <XIcon className="size-3 text-red-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-red-600 line-clamp-2">{error}</p>
          </div>
        )}

        <Button
          onClick={handleGenerateImage}
          disabled={isButtonDisabled}
          className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md nodrag h-9"
        >
          {isProcessing && (
            <>
              <Loader2Icon
                className="size-4 animate-spin mr-1"
                strokeWidth={2}
              />
              <span className="text-sm">Gerando...</span>
            </>
          )}

          {nodeData.status ===
            GenerationImageNodeService.GenerationStatusEnum.COMPLETED && (
            <>
              <span className="text-sm">Sua imagem foi gerada!</span>
              <ArrowRightIcon className="size-4 ml-1" strokeWidth={2} />
            </>
          )}

          {nodeData.status ===
            GenerationImageNodeService.GenerationStatusEnum.FAILED ||
            (nodeData.status ===
              GenerationImageNodeService.GenerationStatusEnum.PENDING && (
              <>
                <SparklesIcon className="size-4 mr-2" strokeWidth={2} />
                <span className="text-sm">Gerar Imagem</span>
              </>
            ))}
        </Button>
      </CardContent>
    </Card>
  );
}
