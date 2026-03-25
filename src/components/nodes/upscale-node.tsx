"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  CoinsIcon,
  Loader2Icon,
  MaximizeIcon,
  Trash2Icon,
} from "lucide-react";

import { useMemo } from "react";
import { useFlow } from "@/contexts/flow-context";
import { useAccount } from "@/hooks/queries/useAccount";
import { GenerationStatusEnum } from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Slider } from "../ui/slider";

type UpscaleNodeData = {
  status: GenerationStatusEnum;
  scale: number;
  isExecuted?: boolean;
  creditsRequired?: number;
  isCalculatingCredits?: boolean;
};

export function UpscaleNode({ id, data, selected }: NodeProps) {
  const {
    updateNodeData,
    getConnectedData,
    flowId,
    updateUpscaleNode,
    generateImageNode,
    calculateCreditsForNode,
    removeNode,
  } = useFlow();
  const nodeData = data as UpscaleNodeData;
  const { me } = useAccount();

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const handleScaleChange = (values: number[]) => {
    updateNodeData(id, { scale: values[0] });
  };

  const handleScaleCommit = async (values: number[]) => {
    try {
      updateNodeData(id, { isCalculatingCredits: true });
      await updateUpscaleNode({
        flowId,
        nodeId: id,
        data: { scale: values[0] },
      });
      await calculateCreditsForNode(id);
    } catch {
      updateNodeData(id, { isCalculatingCredits: false });
    }
  };

  const handleGenerateImage = async () => {
    await generateImageNode({
      flowId,
      nodeGeneratorId: id,
    });
  };

  const hasImages = connectedData.images.length > 0;

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
    !hasImages ||
    nodeData.isExecuted ||
    isProcessing ||
    isCompleted ||
    isCalculating ||
    isCreditsInsufficient;

  const creditsRequired = nodeData.creditsRequired;

  return (
    <Card
      className={`w-80 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-teal-400 ring-2 ring-teal-300 shadow-teal-400 shadow-lg" : "border-teal-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-teal-500! size-3! border-2! border-white!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-teal-500! size-3! border-2! border-white!"
      />

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-teal-500/10 to-cyan-500/10 border-b border-teal-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-sm shrink-0">
          <MaximizeIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Melhorar Qualidade
          </h3>
          <p className="text-[10px] text-teal-500">Aumentar resolução</p>
        </div>
        {hasImages && (
          <span className="text-[10px] font-semibold w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 flex items-center justify-center">
            {connectedData.images.length}
          </span>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-teal-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de upscale"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-3 space-y-3">
        {!hasImages && (
          <div className="py-2 px-3 bg-muted border border-dashed border-border rounded-lg text-center">
            <p className="text-[10px] text-muted-foreground">
              Conecte uma{" "}
              <span className="text-blue-600 font-medium">Imagem</span> ou{" "}
              <span className="text-green-600 font-medium">Resultado</span>
            </p>
          </div>
        )}

        {/* SCALE */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Escala
            </span>
            <span className="text-[10px] font-semibold text-teal-500">
              {nodeData.scale}x
            </span>
          </div>
          <Slider
            value={[nodeData.scale]}
            min={1}
            max={10}
            step={1}
            onValueChange={handleScaleChange}
            onValueCommit={handleScaleCommit}
            disabled={isProcessing || isCompleted}
            className="nodrag nopan"
          />
        </div>

        {/* GENERATE BUTTON */}
        <div className="space-y-1.5">
          <Button
            onClick={handleGenerateImage}
            disabled={isButtonDisabled}
            className={`w-full text-white rounded-lg shadow-sm nodrag nopan h-9 ${
              isCreditsInsufficient && !nodeData.isExecuted
                ? "bg-red-500 hover:bg-red-600 opacity-90"
                : "bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
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
                <span className="text-sm">Processando...</span>
              </>
            ) : isCompleted ? (
              <>
                <span className="text-sm">Upscale concluído!</span>
                <ArrowRightIcon className="size-4 ml-1.5" strokeWidth={2} />
              </>
            ) : (
              <>
                <MaximizeIcon className="size-4 mr-1.5" strokeWidth={2} />
                <span className="text-sm">
                  {isCreditsInsufficient
                    ? "Créditos Insuficientes"
                    : "Aplicar Upscale"}
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
                  <p className="text-center text-[10px] text-teal-500/70 cursor-help underline decoration-dotted underline-offset-2">
                    {creditsRequired} crédito{creditsRequired !== 1 ? "s" : ""}{" "}
                    estimado{creditsRequired !== 1 ? "s" : ""}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="center"
                  className="w-48 text-[11px] text-muted-foreground p-2 text-center z-50 shadow-xl"
                >
                  O consumo final pode variar de acordo com o tamanho da imagem.
                </HoverCardContent>
              </HoverCard>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
