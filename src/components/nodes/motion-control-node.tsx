"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  CoinsIcon,
  Loader2Icon,
  PersonStandingIcon,
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
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

type MotionControlNodeData = {
  status: GenerationStatusEnum;
  keepOriginalSound: boolean;
  isExecuted?: boolean;
  creditsRequired?: number;
  isCalculatingCredits?: boolean;
};

export function MotionControlNode({ id, data, selected }: NodeProps) {
  const {
    updateNodeData,
    getConnectedData,
    flowId,
    updateMotionControlNode,
    generateImageNode,
    calculateCreditsForNode,
    removeNode,
  } = useFlow();
  const nodeData = data as MotionControlNodeData;
  const { me } = useAccount();

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const updateAndRecalculate = async (field: string, value: boolean) => {
    try {
      updateNodeData(id, { [field]: value, isCalculatingCredits: true });
      await updateMotionControlNode({
        flowId,
        nodeId: id,
        data: { [field]: value },
      });
      await calculateCreditsForNode(id);
    } catch {
      updateNodeData(id, { isCalculatingCredits: false });
    }
  };

  const handleGenerate = async () => {
    await generateImageNode({
      flowId,
      nodeGeneratorId: id,
    });
  };

  const hasImages = connectedData.images.length > 0;
  const hasVideos = connectedData.videos.length > 0;
  const hasPrompts = connectedData.prompts.length > 0;
  const isVideoDurationPending =
    hasVideos && connectedData.videoDurations.some((d) => d === null);

  const isProcessing =
    nodeData.status === GenerationStatusEnum.PROCESSING ||
    nodeData.status === GenerationStatusEnum.QUEUED;

  const isCompleted = nodeData.status === GenerationStatusEnum.COMPLETED;
  const isCalculating = nodeData.isCalculatingCredits === true;
  const isDisabledControl = isCalculating || isProcessing || isCompleted;

  const isCreditsInsufficient =
    nodeData.creditsRequired !== undefined &&
    me?.balance.credits !== undefined &&
    nodeData.creditsRequired > me.balance.credits;

  const isButtonDisabled =
    !hasImages ||
    !hasVideos ||
    !hasPrompts ||
    isVideoDurationPending ||
    nodeData.isExecuted ||
    isProcessing ||
    isCompleted ||
    isCalculating ||
    isCreditsInsufficient;

  const creditsRequired = nodeData.creditsRequired;

  return (
    <Card
      className={`w-80 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-pink-400 ring-2 ring-pink-300 shadow-pink-400 shadow-lg" : "border-pink-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-pink-500! size-3! border-2! border-white!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-pink-500! size-3! border-2! border-white!"
      />

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-pink-500/10 to-fuchsia-500/10 border-b border-pink-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center shadow-sm shrink-0">
          <PersonStandingIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Transferir Movimento
          </h3>
          <p className="text-[10px] text-pink-500">Vídeo + imagem</p>
        </div>
        {(hasPrompts || hasImages || hasVideos) && (
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
            {hasVideos && (
              <span className="text-[10px] font-semibold w-5 h-5 rounded-full bg-orange-500/20 text-orange-600 flex items-center justify-center">
                {connectedData.videos.length}
              </span>
            )}
          </div>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-pink-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de motion control"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-3 space-y-3">
        {(!hasImages || !hasVideos || !hasPrompts) && (
          <div className="py-2 px-3 bg-muted border border-dashed border-border rounded-lg text-center">
            <p className="text-[10px] text-muted-foreground">
              Conecte um{" "}
              <span className="text-amber-600 font-medium">Prompt</span>
              {!hasImages && (
                <>
                  {", uma "}
                  <span className="text-blue-600 font-medium">Imagem</span>
                </>
              )}
              {!hasVideos && (
                <>
                  {!hasImages ? " e um " : " e um "}
                  <span className="text-violet-600 font-medium">Vídeo</span>{" "}
                  (máx 30s)
                </>
              )}
            </p>
          </div>
        )}

        {isVideoDurationPending && (
          <div className="flex items-center gap-2 py-1.5 px-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <Loader2Icon className="size-3 text-amber-500 animate-spin shrink-0" />
            <p className="text-[10px] text-amber-600">
              Processando duração do vídeo...
            </p>
          </div>
        )}

        {/* KEEP ORIGINAL SOUND */}
        <div className="flex items-center justify-between">
          <Label
            htmlFor={`sound-${id}`}
            className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide cursor-pointer"
          >
            Manter áudio original
          </Label>
          <Switch
            id={`sound-${id}`}
            checked={nodeData.keepOriginalSound}
            onCheckedChange={(v) =>
              updateAndRecalculate("keepOriginalSound", v)
            }
            disabled={isDisabledControl}
            className="nodrag nopan"
          />
        </div>

        {/* GENERATE BUTTON */}
        <div className="space-y-1.5">
          <Button
            onClick={handleGenerate}
            disabled={isButtonDisabled}
            className={`w-full text-white rounded-lg shadow-sm nodrag nopan h-9 ${
              isCreditsInsufficient && !nodeData.isExecuted
                ? "bg-red-500 hover:bg-red-600 opacity-90"
                : "bg-linear-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
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
                <span className="text-sm">Vídeo gerado!</span>
                <ArrowRightIcon className="size-4 ml-1.5" strokeWidth={2} />
              </>
            ) : (
              <>
                <PersonStandingIcon className="size-4 mr-1.5" strokeWidth={2} />
                <span className="text-sm">
                  {isCreditsInsufficient
                    ? "Créditos Insuficientes"
                    : "Gerar Motion"}
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
                  <p className="text-center text-[10px] text-pink-500/70 cursor-help underline decoration-dotted underline-offset-2">
                    {creditsRequired} crédito{creditsRequired !== 1 ? "s" : ""}{" "}
                    estimado{creditsRequired !== 1 ? "s" : ""}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="center"
                  className="w-48 text-[11px] text-muted-foreground p-2 text-center z-50 shadow-xl"
                >
                  O custo varia com a duração do vídeo de referência.
                </HoverCardContent>
              </HoverCard>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
