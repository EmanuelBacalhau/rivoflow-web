"use client";

import {
  ImagePlusIcon,
  MessageCircleMoreIcon,
  SparklesIcon,
} from "lucide-react";

interface ToolbarProps {
  onAddPromptNode: () => void;
  onAddImageNode: () => void;
  onAddGenerationImageNode: () => void;
}

interface NodeButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  color: string;
  iconColor: string;
  onClick: () => void;
}

function NodeButton({
  icon,
  label,
  shortcut,
  color,
  iconColor,
  onClick,
}: NodeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm ${color}`}
    >
      <span className={`shrink-0 ${iconColor}`}>{icon}</span>
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <span className="ml-1 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono hidden group-hover:inline">
        {shortcut}
      </span>
    </button>
  );
}

export function Toolbar({
  onAddPromptNode,
  onAddImageNode,
  onAddGenerationImageNode,
}: ToolbarProps) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1.5 rounded-xl shadow-lg border border-gray-200/80">
      {/* Label */}
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-1 mr-1">
        Nós
      </span>

      <div className="w-px h-5 bg-gray-200" />

      {/* Inputs group */}
      <div className="flex items-center gap-1 px-1">
        <NodeButton
          icon={<MessageCircleMoreIcon className="size-3.5" />}
          label="Prompt"
          shortcut="P"
          color="border-amber-200 bg-amber-50/80 hover:bg-amber-100 hover:border-amber-300"
          iconColor="text-amber-600"
          onClick={onAddPromptNode}
        />
        <NodeButton
          icon={<ImagePlusIcon className="size-3.5" />}
          label="Imagem"
          shortcut="I"
          color="border-blue-200 bg-blue-50/80 hover:bg-blue-100 hover:border-blue-300"
          iconColor="text-blue-600"
          onClick={onAddImageNode}
        />
      </div>

      <div className="w-px h-5 bg-gray-200" />

      {/* Generator */}
      <div className="px-1">
        <NodeButton
          icon={<SparklesIcon className="size-3.5" />}
          label="Gerar Imagem"
          shortcut="G"
          color="border-purple-200 bg-purple-50/80 hover:bg-purple-100 hover:border-purple-300"
          iconColor="text-purple-600"
          onClick={onAddGenerationImageNode}
        />
      </div>
    </div>
  );
}
