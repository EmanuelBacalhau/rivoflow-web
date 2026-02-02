"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  MessageCircleMoreIcon,
  SparklesIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { useFlow } from "@/contexts/FlowContext";
import {
  type AspectRatio,
  generateImage,
  type ImageSize,
} from "@/lib/google-ai";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
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

interface AIGeneratorNodeData {
  format?: AspectRatio;
  quality?: ImageSize;
}

export function AIGeneratorNode({ id, data }: NodeProps) {
  const { updateNodeData, getConnectedData, addResultNode } = useFlow();
  const nodeData = data as AIGeneratorNodeData;
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInputs, setShowInputs] = useState(false);

  const connectedData = useMemo(() => {
    return getConnectedData(id);
  }, [id, getConnectedData]);

  const handleFormatChange = useCallback(
    (value: string) => {
      updateNodeData(id, { format: value as AspectRatio });
    },
    [id, updateNodeData],
  );

  const handleQualityChange = useCallback(
    (value: string) => {
      updateNodeData(id, { quality: value as ImageSize });
    },
    [id, updateNodeData],
  );

  const handleGenerate = useCallback(async () => {
    setError(null);
    setIsGenerating(true);

    try {
      const { prompts, images } = connectedData;

      if (prompts.length === 0) {
        throw new Error("Conecte pelo menos um node de prompt");
      }

      const combinedPrompt = prompts.join("\n\n");

      const imageUrl = await generateImage({
        prompt: combinedPrompt,
        referenceImages: images,
        aspectRatio: nodeData.format || "1:1",
        imageSize: nodeData.quality || "2K",
      });

      addResultNode(id, imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar imagem");
    } finally {
      setIsGenerating(false);
    }
  }, [id, connectedData, addResultNode, nodeData.format, nodeData.quality]);

  const hasPrompts = connectedData.prompts.length > 0;
  const hasImages = connectedData.images.length > 0;
  const hasAnyInput = hasPrompts || hasImages;

  return (
    <Card className="w-78 p-1 shadow-lg border-primary/30 bg-linear-to-b from-card to-primary/5">
      <Handle
        type="source"
        position={Position.Right}
        className="bg-primary! size-3! border-2! border-card!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="bg-primary! size-3! border-2! border-card!"
      />

      <CardContent className="p-3 space-y-3">
        {/* Header */}
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
              <Button
                variant="ghost"
                size="icon"
                className="size-6 nodrag"
                onClick={() => setShowInputs(!showInputs)}
              >
                {showInputs ? (
                  <ChevronUpIcon className="size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )}
              </Button>
            </div>
          )}
        </header>

        {/* Inputs Dinâmicos (colapsável) */}
        {showInputs && hasAnyInput && (
          <ScrollArea className="">
            <div className="space-y-1.5 pr-2">
              {connectedData.prompts.map((prompt, index) => (
                <div
                  key={`prompt-${index}`}
                  className="p-1.5 bg-amber-50 border border-amber-200 rounded text-[10px] text-gray-700 line-clamp-2"
                >
                  <MessageCircleMoreIcon className="size-3 text-amber-600 inline mr-1" />
                  {prompt}
                </div>
              ))}
              {connectedData.images.map((imageUrl, index) => (
                <div
                  key={`image-${index}`}
                  className="flex items-center gap-1.5 p-1.5 bg-blue-50 border border-blue-200 rounded"
                >
                  <div className="size-8 rounded overflow-hidden bg-gray-100 shrink-0">
                    <Image
                      src={imageUrl}
                      alt={`Ref ${index + 1}`}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-blue-700">
                    Referência {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Mensagem se não houver inputs */}
        {!hasAnyInput && (
          <div className="p-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg text-center">
            <p className="text-[10px] text-gray-500">
              Conecte <span className="text-amber-600">Prompt</span> ou{" "}
              <span className="text-blue-600">Imagem</span>
            </p>
          </div>
        )}

        <Separator />

        {/* Configurações */}
        <div className="grid grid-cols-2 gap-2">
          {/* Formato */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-gray-500">
              Formato
            </span>
            <Select value={nodeData.format} onValueChange={handleFormatChange}>
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

          {/* Qualidade */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-gray-500">
              Qualidade
            </span>
            <Select
              value={nodeData.quality}
              onValueChange={handleQualityChange}
            >
              <SelectTrigger className="w-full nodrag h-8 text-xs">
                <SelectValue placeholder="2K" />
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

        {/* Erro */}
        {error && (
          <div className="flex items-start gap-1.5 p-2 bg-red-50 border border-red-200 rounded-lg">
            <XIcon className="size-3 text-red-500 mt-0.5 shrink-0" />
            <p className="text-[10px] text-red-600 line-clamp-2">{error}</p>
          </div>
        )}

        {/* Botão Gerar */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !hasPrompts}
          className="w-full bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md nodrag h-9"
        >
          {isGenerating ? (
            <>
              <Loader2Icon
                className="size-4 animate-spin mr-2"
                strokeWidth={2}
              />
              <span className="text-sm">Gerando...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="size-4 mr-2" strokeWidth={2} />
              <span className="text-sm">Gerar Imagem</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
