"use client";

import {
  ImagePlusIcon,
  MessageCircleMoreIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "./ui/button";

interface ToolbarProps {
  onAddPromptNode: () => void;
  onAddImageNode: () => void;
  onAddGenerationImageNode: () => void;
  // imageNodeCount: number;
  // maxImageNodes: number;
}

export function Toolbar({
  onAddPromptNode,
  onAddImageNode,
  onAddGenerationImageNode,
  // imageNodeCount,
  // maxImageNodes,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/95 backdrop-blur-sm p-2 rounded-xl shadow-lg border border-gray-200">
      {/* Inputs */}
      <Button
        variant="outline"
        size="sm"
        onClick={onAddPromptNode}
        className="h-9 px-3 bg-amber-50 hover:bg-amber-100 border-amber-200 text-gray-700"
      >
        <MessageCircleMoreIcon className="size-4 text-amber-600 mr-2" />
        Prompt
      </Button>

      {/* Images */}
      <Button
        variant="outline"
        size="sm"
        onClick={onAddImageNode}
        className="h-9 px-3 bg-blue-50 hover:bg-blue-100 border-blue-200 text-gray-700 disabled:opacity-50"
      >
        <ImagePlusIcon className="size-4 text-blue-600 mr-2" />
        Imagem
      </Button>

      {/* Generators */}
      <Button
        variant="outline"
        size="sm"
        onClick={onAddGenerationImageNode}
        className="h-9 px-3 bg-purple-50 hover:bg-purple-100 border-purple-200 text-gray-700"
      >
        <SparklesIcon className="size-4 text-purple-600 mr-2" />
        Gerar Imagem
      </Button>
    </div>
  );
}
