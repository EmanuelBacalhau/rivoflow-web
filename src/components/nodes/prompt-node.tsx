"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { CheckIcon, MessageCircleMoreIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";
import { useFlow } from "@/contexts/flow-context";
import type { PromptNodeService } from "@/services/node/prompt-node-service";
import { debounce } from "@/utils/debounce";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Textarea } from "../ui/textarea";

type PromptNodeData = PromptNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function PromptNode({ id: nodeId, data, selected }: NodeProps) {
  const {
    updateNodeData,
    flowId,
    updatePromptNode,
    markConnectedGeneratorsAsCalculating,
    removeNode,
  } = useFlow();
  const nodeData = data as PromptNodeData;

  const charCount = nodeData.prompt?.length ?? 0;

  const updatePromptNodeRef = useRef(updatePromptNode);
  updatePromptNodeRef.current = updatePromptNode;

  const updatePromptNodeDebouncedRef = useRef(
    debounce((params: PromptNodeService.UpdateParams) => {
      updatePromptNodeRef.current(params);
    }, 1000),
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    updateNodeData(nodeId, { prompt: value });
    markConnectedGeneratorsAsCalculating(nodeId);
    updatePromptNodeDebouncedRef.current({
      flowId,
      nodeId,
      data: { ...nodeData, prompt: value },
    });
  };

  return (
    <Card
      className={`w-72 gap-0 py-0 shadow-md overflow-hidden transition-shadow ${selected ? "border-amber-400 ring-2 ring-amber-300 shadow-amber-400 shadow-lg" : "border-amber-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="size-3! bg-amber-400! border-2! border-white!"
      />

      <CardHeader className="flex flex-row items-center gap-2.5 px-3 py-2.5! bg-linear-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/20 space-y-0">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shrink-0">
          <MessageCircleMoreIcon
            className="size-3.5 text-white"
            strokeWidth={2}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-card-foreground leading-tight">
            Texto
          </h3>
          <p className="text-[10px] text-amber-500">Descreva sua ideia</p>
        </div>
        {nodeData.isExecuted && (
          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CheckIcon className="size-3 text-green-600" />
          </div>
        )}
        <button
          onClick={() => removeNode(nodeId)}
          className="text-amber-500/50 hover:text-red-500 transition-colors shrink-0 nodrag cursor-pointer md:hidden"
          type="button"
          aria-label="Remover nó de prompt"
        >
          <Trash2Icon className="size-3.5" />
        </button>
      </CardHeader>

      <CardContent className="p-3 space-y-2">
        <Textarea
          className="nodrag nopan nowheel resize-none min-h-24 text-xs bg-muted border-amber-500/30 focus-visible:ring-amber-500/30 placeholder:text-muted-foreground"
          placeholder="Ex: produto minimalista, fundo clean, luz natural suave..."
          value={nodeData.prompt || ""}
          onChange={handleChange}
          disabled={nodeData.isExecuted}
        />
        {charCount > 0 && (
          <div className="flex justify-end">
            <span className="text-[10px] text-muted-foreground">
              {charCount} characters
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
