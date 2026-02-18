"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { CheckIcon, MessageCircleMoreIcon } from "lucide-react";
import { useFlow } from "@/contexts/flow";
import type { PromptNodeService } from "@/services/node/PromptNodeService";
import { debounce } from "@/utils/debounce";
import { Textarea } from "../ui/textarea";

type PromptNodeData = PromptNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function PromptNode({ id: nodeId, data, selected }: NodeProps) {
  const { updateNodeData, flowId, updatePromptNode } = useFlow();
  const nodeData = data as PromptNodeData;

  const charCount = nodeData.prompt?.length ?? 0;

  const updatePromptNodeDebounced = debounce(updatePromptNode, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    updateNodeData(nodeId, { prompt: value });
    updatePromptNodeDebounced({
      flowId,
      nodeId,
      data: { ...nodeData, prompt: value },
    });
  };

  return (
    <div
      className={`w-72 rounded-xl border bg-white shadow-md overflow-hidden transition-shadow ${selected ? "border-amber-400 ring-2 ring-amber-300 shadow-amber-100 shadow-lg" : "border-amber-200"}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        className="size-3! bg-amber-400! border-2! border-white!"
      />

      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-linear-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-sm shrink-0">
          <MessageCircleMoreIcon
            className="size-3.5 text-white"
            strokeWidth={2}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-gray-800 leading-tight">
            Prompt
          </h3>
          <p className="text-[10px] text-amber-600/80">Descreva o estilo</p>
        </div>
        {nodeData.isExecuted && (
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <CheckIcon className="size-3 text-green-600" />
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <Textarea
          className="nodrag resize-none h-24 text-xs bg-gray-50 border-amber-200 focus-visible:ring-amber-300 placeholder:text-gray-400"
          placeholder="Ex: produto minimalista, fundo clean, luz natural suave..."
          value={nodeData.prompt || ""}
          onChange={handleChange}
          disabled={nodeData.isExecuted}
        />
        {charCount > 0 && (
          <div className="flex justify-end">
            <span className="text-[10px] text-gray-400">{charCount} chars</span>
          </div>
        )}
      </div>
    </div>
  );
}
