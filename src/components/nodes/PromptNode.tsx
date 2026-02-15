"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { CheckIcon, MessageCircleMoreIcon } from "lucide-react";
import { useState } from "react";
import { useFlow } from "@/contexts/flow";
import { useUpdateDataPromptNodeController } from "@/contexts/flow/controllers/prompt/update";
import type { PromptNodeService } from "@/services/node/PromptNodeService";
import { debounce } from "@/utils/debounce";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";

type PromptNodeData = PromptNodeService.Node["data"] & {
  isExecuted?: boolean;
};

export function PromptNode({ id: nodeId, data }: NodeProps) {
  const { updateNodeData, flowId } = useFlow();
  const [nodeData, setNodeData] = useState<PromptNodeData>(
    data as PromptNodeData,
  );
  const [charCount] = useState(nodeData.prompt?.length || 0);

  const { updatePromptNode } = useUpdateDataPromptNodeController();

  const updatePromptNodeDebounced = debounce(updatePromptNode, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setNodeData((prev) => ({ ...prev, prompt: value }));
    updateNodeData(nodeId, { prompt: value });
    updatePromptNodeDebounced({
      flowId,
      nodeId,
      nodeType: nodeData.type,
      data: {
        ...nodeData,
        prompt: value,
      },
    });
  };

  return (
    <Card className="w-72 p-0 shadow-lg border-amber-200 bg-linear-to-b from-white to-amber-50/30">
      <Handle
        type="source"
        position={Position.Right}
        className="size-3! bg-amber-400! border-2! border-white!"
      />

      <CardContent className="p-2 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-amber-400 to-amber-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <MessageCircleMoreIcon
              className="size-4 text-white"
              strokeWidth={2}
            />
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="font-semibold text-sm">Prompt</h3>
            <span className="text-xs text-gray-500">Descreva o estilo</span>
          </div>

          {nodeData.isExecuted && (
            <div className="bg-green-100 p-1 rounded-full grid place-items-center">
              <CheckIcon className="size-4 text-green-500" />
            </div>
          )}
        </header>

        <div className="space-y-1.5">
          <Textarea
            className="resize-none h-24 text-xs bg-white border-amber-200"
            placeholder="Descreva o produto e o estilo da propaganda..."
            value={nodeData.prompt || ""}
            onChange={handleChange}
            disabled={nodeData.isExecuted}
          />

          <div className="flex justify-end ">
            <span className="text-[10px] text-gray-400">
              {charCount > 0 ? `${charCount} caracteres` : ""}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
