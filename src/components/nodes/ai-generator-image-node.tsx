"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  CoinsIcon,
  Loader2Icon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";

import { useMemo } from "react";
import { useFlow } from "@/contexts/flow-context";
import { useAccount } from "@/hooks/queries/useAccount";
import {
  type AspectRatio,
  GenerationStatusEnum,
  type ImageSize,
  type NodeDataGenerationImage,
} from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type AIGeneratorNodeData = NodeDataGenerationImage & {
  isExecuted?: boolean;
  creditsRequired?: number;
  isCalculatingCredits?: boolean;
};

export function AIGeneratorNode({ id, data, selected }: NodeProps) {
  const {
    updateNodeData,
    getConnectedData,
    flowId,
    updateGenerationImageNode,
    generateImageNode,
    calculateCreditsForNode,
  } = useFlow();
  const nodeData = data as AIGeneratorNodeData;
  const { me } = useAccount();

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const handleFormatChange = async (value: string) => {
    updateNodeData(id, { format: value as AspectRatio });
    await updateGenerationImageNode({
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
    calculateCreditsForNode(id);
  };

  const handleQualityChange = async (value: string) => {
    updateNodeData(id, { quality: value as ImageSize });
    await updateGenerationImageNode({
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
    calculateCreditsForNode(id);
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
    nodeData.status === GenerationStatusEnum.PROCESSING ||
    nodeData.status === GenerationStatusEnum.QUEUED;

  const isCompleted = nodeData.status === GenerationStatusEnum.COMPLETED;

  const isCalculating = nodeData.isCalculatingCredits === true;

  const isCreditsInsufficient =
    nodeData.creditsRequired !== undefined &&
    me?.balance.credits !== undefined &&
    nodeData.creditsRequired > me.balance.credits;

  const isButtonDisabled =
    !hasPrompts ||
    nodeData.isExecuted ||
    isProcessing ||
    isCompleted ||
    isCalculating ||
    isCreditsInsufficient;

  const creditsRequired = nodeData.creditsRequired;

  return (
    <Card
      className={`w-80 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-purple-400 ring-2 ring-purple-300 shadow-purple-400 shadow-lg" : "border-purple-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-purple-500! size-3! border-2! border-white!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-purple-500! size-3! border-2! border-white!"
      />

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-purple-500/10 to-violet-500/10 border-b border-purple-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-sm shrink-0">
          <SparklesIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Gerador AI
          </h3>
          <p className="text-[10px] text-purple-500">Gere imagens com IA</p>
        </div>
        {hasAnyInput && (
          <div className="flex gap-1">
            {hasPrompts && (
              <span className="text-[10px] font-semibold w-5 h-5 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center">
                {connectedData.prompts.length}
              </span>
            )}
            {hasImages && (
              <span className="text-[10px] font-semibold w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 flex items-center justify-center">
                {connectedData.images.length}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      {/* Body */}
      <CardContent className="p-3 space-y-3">
        {!hasAnyInput && (
          <div className="py-2 px-3 bg-muted border border-dashed border-border rounded-lg text-center">
            <p className="text-[10px] text-muted-foreground">
              Conecte um{" "}
              <span className="text-amber-600 font-medium">Prompt</span> ou{" "}
              <span className="text-blue-600 font-medium">Imagem</span>
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* FORMAT */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
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
          {/* QUALITY */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
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

        {/* GENERATE BUTTON */}
        <div className="space-y-1.5">
          <Button
            onClick={handleGenerateImage}
            disabled={isButtonDisabled}
            className={`w-full text-white rounded-lg shadow-sm nodrag h-9 ${
              isCreditsInsufficient && !nodeData.isExecuted
                ? "bg-red-500 hover:bg-red-600 opacity-90"
                : "bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            }`}
          >
            {isCalculating ? (
              <>
                <Loader2Icon
                  className="size-4 animate-spin mr-1.5"
                  strokeWidth={2}
                />
                <span className="text-sm">Calculando...</span>
              </>
            ) : isProcessing ? (
              <>
                <Loader2Icon
                  className="size-4 animate-spin mr-1.5"
                  strokeWidth={2}
                />
                <span className="text-sm">Gerando...</span>
              </>
            ) : isCompleted ? (
              <>
                <span className="text-sm">Imagem gerada!</span>
                <ArrowRightIcon className="size-4 ml-1.5" strokeWidth={2} />
              </>
            ) : (
              <>
                <SparklesIcon className="size-4 mr-1.5" strokeWidth={2} />
                <span className="text-sm">
                  {isCreditsInsufficient
                    ? "Créditos Insuficientes"
                    : "Gerar Imagem"}
                </span>
                {creditsRequired !== undefined && (
                  <span className="ml-auto flex items-center gap-0.5 text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full leading-none">
                    <CoinsIcon className="size-2.5" />
                    {creditsRequired}
                  </span>
                )}
              </>
            )}
          </Button>

          {creditsRequired !== undefined &&
            !isCalculating &&
            !isProcessing &&
            !isCompleted && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <p className="text-center text-[10px] text-purple-500/70 cursor-help underline decoration-dotted underline-offset-2">
                    {creditsRequired} crédito{creditsRequired !== 1 ? "s" : ""}{" "}
                    estimado{creditsRequired !== 1 ? "s" : ""}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="center"
                  className="w-48 text-[11px] text-muted-foreground p-2 text-center z-50 shadow-xl"
                >
                  O consumo final pode variar um pouco de acordo com o peso da
                  geração e imagens enviadas.
                </HoverCardContent>
              </HoverCard>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
