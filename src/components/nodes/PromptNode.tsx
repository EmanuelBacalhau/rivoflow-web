"use client";

import { Handle, type NodeProps, Position } from "@xyflow/react";
import { CheckIcon, CopyIcon, MessageCircleMoreIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useFlow } from "@/contexts/FlowContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Textarea } from "../ui/textarea";

interface PromptNodeData {
  prompt?: string;
}

export function PromptNode({ id, data }: NodeProps) {
  const { updateNodeData } = useFlow();
  const nodeData = data as PromptNodeData;
  const [copied, setCopied] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { prompt: e.target.value });
    },
    [id, updateNodeData],
  );

  const handleCopy = useCallback(() => {
    if (nodeData.prompt) {
      navigator.clipboard.writeText(nodeData.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [nodeData.prompt]);

  const charCount = nodeData.prompt?.length || 0;

  return (
    <Card className="w-72 p-1 shadow-lg border-amber-200 bg-linear-to-b from-white to-amber-50/30">
      <Handle
        type="source"
        position={Position.Right}
        className="size-3! bg-amber-400! border-2! border-white!"
      />

      <CardContent className="p-3 space-y-3">
        <header className="flex items-center gap-2">
          <div className="bg-linear-to-br from-amber-400 to-amber-600 p-2 grid place-items-center rounded-lg shadow-sm">
            <MessageCircleMoreIcon
              className="size-4 text-white"
              strokeWidth={2}
            />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-sm">Prompt</h3>
            <span className="text-xs text-gray-500">Descreva o estilo</span>
          </div>

          {nodeData.prompt && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7 nodrag"
              onClick={handleCopy}
            >
              {copied ? (
                <CheckIcon className="size-3.5 text-green-500" />
              ) : (
                <CopyIcon className="size-3.5 text-gray-400" />
              )}
            </Button>
          )}
        </header>

        <div className="space-y-1.5">
          <Textarea
            className="resize-none h-24 text-xs bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400/20 nodrag"
            placeholder="Descreva o produto e o estilo da propaganda..."
            value={nodeData.prompt || ""}
            onChange={handleChange}
          />
          <div className="flex justify-between items-center px-1">
            <span className="text-[10px] text-gray-400">
              {charCount > 0 ? `${charCount} caracteres` : ""}
            </span>
            {charCount > 500 && (
              <span className="text-[10px] text-amber-600">
                Prompt longo pode afetar resultado
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
