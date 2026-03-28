"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ArrowRightIcon,
  CoinsIcon,
  ImageIcon,
  Loader2Icon,
  Trash2Icon,
  VideoIcon,
} from "lucide-react";
import Image from "next/image";

import { useMemo } from "react";
import { useFlow } from "@/contexts/flow-context";
import { useAccount } from "@/hooks/queries/useAccount";
import {
  GenerationStatusEnum,
  type VideoAspectRatio,
  type VideoDuration,
  type VideoResolution,
  type VideoTier,
} from "@/types";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

type ImageToVideoNodeData = {
  status: GenerationStatusEnum;
  tier: string;
  duration: string;
  resolution: string;
  aspectRatio: string;
  generateAudio: boolean;
  isExecuted?: boolean;
  creditsRequired?: number;
  isCalculatingCredits?: boolean;
};

export function ImageToVideoNode({ id, data, selected }: NodeProps) {
  const {
    updateNodeData,
    getConnectedData,
    flowId,
    updateImageToVideoNode,
    generateImageNode,
    calculateCreditsForNode,
    removeNode,
  } = useFlow();
  const nodeData = data as ImageToVideoNodeData;
  const { me } = useAccount();

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const STANDARD_DURATIONS = ["6", "8", "10"];

  const updateAndRecalculate = async (
    field: string,
    value: string | boolean,
  ) => {
    try {
      const updates: Record<string, string | boolean> = { [field]: value };

      if (field === "tier" && value === "standard") {
        if (!STANDARD_DURATIONS.includes(nodeData.duration)) {
          updates.duration = "6";
        }
      }

      updateNodeData(id, { ...updates, isCalculatingCredits: true });
      await updateImageToVideoNode({
        flowId,
        nodeId: id,
        data: updates,
      });
      await calculateCreditsForNode(id);
    } catch {
      updateNodeData(id, { isCalculatingCredits: false });
    }
  };

  const handleGenerateVideo = async () => {
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
  const isDisabledControl = isCalculating || isProcessing || isCompleted;

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
      className={`w-80 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-orange-400 ring-2 ring-orange-300 shadow-orange-400 shadow-lg" : "border-orange-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="bg-orange-500! size-3! border-2! border-white!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-orange-500! size-3! border-2! border-white!"
      />

      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-orange-500/10 to-amber-500/10 border-b border-orange-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm shrink-0">
          <VideoIcon className="size-3.5 text-white" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Imagem → Vídeo
          </h3>
          <p className="text-[10px] text-orange-500">A partir de imagem</p>
        </div>
        {hasImages && (
          <span className="text-[10px] font-semibold w-5 h-5 rounded-full bg-sky-500/20 text-sky-600 flex items-center justify-center">
            {connectedData.images.length}
          </span>
        )}
        <button
          onClick={() => removeNode(id)}
          className="text-orange-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de vídeo"
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

        {hasImages && nodeData.tier === "premium" && (
          <div className="flex gap-2">
            {/* Start frame */}
            <div className="flex-1 space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-wider text-green-600 bg-green-500/15 px-1.5 py-0.5 rounded inline-block">
                Start
              </span>
              <div className="relative w-full h-16 rounded-md overflow-hidden border border-green-500/30">
                <Image
                  src={connectedData.images[0]}
                  alt="Start frame"
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* End frame */}
            <div className="flex-1 space-y-1">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded inline-block ${connectedData.images.length >= 2 ? "text-blue-600 bg-blue-500/15" : "text-muted-foreground bg-muted-foreground/10"}`}
              >
                End
              </span>
              {connectedData.images.length >= 2 ? (
                <div className="relative w-full h-16 rounded-md overflow-hidden border border-blue-500/30">
                  <Image
                    src={connectedData.images[1]}
                    alt="End frame"
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-16 rounded-md border border-dashed border-border flex items-center justify-center bg-muted/50">
                  <ImageIcon className="size-4 text-muted-foreground/40" />
                </div>
              )}
            </div>
          </div>
        )}

        {hasImages && nodeData.tier !== "premium" && (
          <div className="relative w-full h-20 rounded-lg overflow-hidden border border-orange-500/20">
            <Image
              src={connectedData.images[0]}
              alt="Imagem conectada"
              fill
              sizes="280px"
              className="object-cover"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {/* TIER */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Qualidade
            </span>
            <Select
              value={nodeData.tier}
              onValueChange={(v) =>
                updateAndRecalculate("tier", v as VideoTier)
              }
              disabled={isDisabledControl}
            >
              <SelectTrigger className="w-full nodrag nopan h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="nowheel">
                <SelectGroup>
                  <SelectItem value="standard">
                    <span className="text-xs">Padrão</span>
                  </SelectItem>
                  <SelectItem value="premium">
                    <span className="text-xs">Premium</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* DURATION */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Duração
            </span>
            <Select
              value={nodeData.duration}
              onValueChange={(v) =>
                updateAndRecalculate("duration", v as VideoDuration)
              }
              disabled={isDisabledControl}
            >
              <SelectTrigger className="w-full nodrag nopan h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="nowheel">
                <SelectGroup>
                  <SelectLabel className="text-[10px]">Segundos</SelectLabel>
                  {(nodeData.tier === "premium"
                    ? ["3", "4", "5", "6", "7", "8", "9", "10"]
                    : ["6", "8", "10"]
                  ).map((s) => (
                    <SelectItem key={s} value={s}>
                      <span className="text-xs">{s}s</span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {/* RESOLUTION */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Resolução
            </span>
            <Select
              value={nodeData.resolution}
              onValueChange={(v) =>
                updateAndRecalculate("resolution", v as VideoResolution)
              }
              disabled={isDisabledControl}
            >
              <SelectTrigger className="w-full nodrag nopan h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="nowheel">
                <SelectGroup>
                  <SelectItem value="1080p">
                    <span className="text-xs">1080p Full HD</span>
                  </SelectItem>
                  <SelectItem value="1440p">
                    <span className="text-xs">1440p 2K</span>
                  </SelectItem>
                  <SelectItem value="2160p">
                    <span className="text-xs">2160p 4K</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* ASPECT RATIO */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Formato
            </span>
            <Select
              value={nodeData.aspectRatio}
              onValueChange={(v) =>
                updateAndRecalculate("aspectRatio", v as VideoAspectRatio)
              }
              disabled={isDisabledControl}
            >
              <SelectTrigger className="w-full nodrag nopan h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="nowheel">
                <SelectGroup>
                  <SelectItem value="auto">
                    <span className="text-xs">Auto</span>
                  </SelectItem>
                  <SelectItem value="16:9">
                    <span className="text-xs">16:9 Paisagem</span>
                  </SelectItem>
                  <SelectItem value="9:16">
                    <span className="text-xs">9:16 Story</span>
                  </SelectItem>
                  <SelectItem value="1:1">
                    <span className="text-xs">1:1 Quadrado</span>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* AUDIO */}
        <div className="flex items-center justify-between">
          <Label
            htmlFor={`audio-${id}`}
            className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide cursor-pointer"
          >
            Gerar áudio
          </Label>
          <Switch
            id={`audio-${id}`}
            checked={nodeData.generateAudio}
            onCheckedChange={(v) => updateAndRecalculate("generateAudio", v)}
            disabled={isDisabledControl}
            className="nodrag nopan"
          />
        </div>

        {/* GENERATE BUTTON */}
        <div className="space-y-1.5">
          <Button
            onClick={handleGenerateVideo}
            disabled={isButtonDisabled}
            className={`w-full text-white rounded-lg shadow-sm nodrag nopan h-9 ${
              isCreditsInsufficient && !nodeData.isExecuted
                ? "bg-red-500 hover:bg-red-600 opacity-90"
                : "bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
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
                <VideoIcon className="size-4 mr-1.5" strokeWidth={2} />
                <span className="text-sm">
                  {isCreditsInsufficient
                    ? "Créditos Insuficientes"
                    : "Gerar Vídeo"}
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
                  <p className="text-center text-[10px] text-orange-500/70 cursor-help underline decoration-dotted underline-offset-2">
                    {creditsRequired} crédito{creditsRequired !== 1 ? "s" : ""}{" "}
                    estimado{creditsRequired !== 1 ? "s" : ""}
                  </p>
                </HoverCardTrigger>
                <HoverCardContent
                  side="bottom"
                  align="center"
                  className="w-48 text-[11px] text-muted-foreground p-2 text-center z-50 shadow-xl"
                >
                  O custo varia com a duração, resolução e tier escolhidos.
                </HoverCardContent>
              </HoverCard>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
