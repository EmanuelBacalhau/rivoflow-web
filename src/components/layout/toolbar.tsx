"use client";

import {
  EraserIcon,
  ImagePlusIcon,
  MaximizeIcon,
  MessageCircleMoreIcon,
  PersonStandingIcon,
  PlusIcon,
  SparklesIcon,
  TypeIcon,
  VideoIcon,
  VideotapeIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface ToolbarProps {
  onAddPromptNode: () => void;
  onAddImageNode: () => void;
  onAddGenerationImageNode: () => void;
  onAddTextToImageNode: () => void;
  onAddUpscaleNode: () => void;
  onAddRemoveBgNode: () => void;
  onAddVideoNode: () => void;
  onAddImageToVideoNode: () => void;
  onAddMotionControlNode: () => void;
}

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  color: string;
  onClick: () => void;
}

function ToolButton({
  icon,
  label,
  shortcut,
  color,
  onClick,
}: ToolButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={`relative size-9 flex items-center justify-center rounded-lg transition-all duration-150 hover:bg-accent active:scale-95 cursor-pointer ${color}`}
        >
          {icon}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        <span>{label}</span>
        {shortcut && (
          <kbd className="ml-1.5 inline-flex items-center justify-center size-4 rounded bg-background/20 font-mono text-[10px] leading-none">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

interface AIToolItemProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  shortcut: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

function AIToolItem({
  icon,
  label,
  description,
  shortcut,
  color,
  bgColor,
  onClick,
}: AIToolItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-150 hover:bg-accent active:scale-[0.98] cursor-pointer text-left group"
    >
      <div
        className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${bgColor} ${color} transition-transform duration-150 group-hover:scale-110`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-foreground">
            {label}
          </span>
          <kbd className="inline-flex items-center justify-center px-1.5 h-4 rounded bg-muted font-mono text-[10px] text-muted-foreground leading-none">
            {shortcut}
          </kbd>
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
          {description}
        </p>
      </div>
    </button>
  );
}

export function Toolbar({
  onAddPromptNode,
  onAddImageNode,
  onAddGenerationImageNode,
  onAddTextToImageNode,
  onAddUpscaleNode,
  onAddRemoveBgNode,
  onAddVideoNode,
  onAddImageToVideoNode,
  onAddMotionControlNode,
}: ToolbarProps) {
  const { isMobile } = useSidebar();
  const [aiOpen, setAiOpen] = useState(false);

  const handleAITool = (fn: () => void) => {
    fn();
    setAiOpen(false);
  };

  return (
    <div
      className={`absolute top-3 ${isMobile ? "left-3 right-3" : "left-1/2 -translate-x-1/2"} z-10`}
    >
      <div className="inline-flex items-center gap-0.5 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg px-1.5 py-1">
        {isMobile && <SidebarTrigger className="size-9" />}

        {/* Input nodes */}
        <ToolButton
          icon={<MessageCircleMoreIcon className="size-4" strokeWidth={1.8} />}
          label="Prompt"
          shortcut="P"
          color="text-amber-500"
          onClick={onAddPromptNode}
        />
        <ToolButton
          icon={<ImagePlusIcon className="size-4" strokeWidth={1.8} />}
          label="Imagem"
          shortcut="I"
          color="text-blue-500"
          onClick={onAddImageNode}
        />
        <ToolButton
          icon={<VideotapeIcon className="size-4" strokeWidth={1.8} />}
          label="Vídeo"
          shortcut="O"
          color="text-violet-500"
          onClick={onAddVideoNode}
        />

        {/* Divider */}
        <div className="w-px h-5 bg-border mx-1" />

        {/* AI tools popover */}
        <Popover open={aiOpen} onOpenChange={setAiOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-linear-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 border border-purple-500/20 transition-all duration-150 active:scale-95 cursor-pointer"
            >
              <WandSparklesIcon
                className="size-4 text-purple-500"
                strokeWidth={1.8}
              />
              <span className="text-[12px] font-semibold text-foreground">
                IA
              </span>
              <PlusIcon
                className="size-3 text-muted-foreground"
                strokeWidth={2}
              />
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="bottom"
            align="end"
            sideOffset={8}
            className="w-72 p-1.5 rounded-xl"
          >
            <div className="space-y-0.5">
              <AIToolItem
                icon={<TypeIcon className="size-4" strokeWidth={1.8} />}
                label="Gerar Imagem"
                description="Texto para imagem"
                shortcut="T"
                color="text-indigo-600"
                bgColor="bg-indigo-500/15"
                onClick={() => handleAITool(onAddTextToImageNode)}
              />
              <AIToolItem
                icon={<SparklesIcon className="size-4" strokeWidth={1.8} />}
                label="Editar Imagem"
                description="Prompt + imagem de referência"
                shortcut="G"
                color="text-purple-600"
                bgColor="bg-purple-500/15"
                onClick={() => handleAITool(onAddGenerationImageNode)}
              />

              <div className="h-px bg-border mx-2 my-1" />

              <AIToolItem
                icon={<MaximizeIcon className="size-4" strokeWidth={1.8} />}
                label="Upscale"
                description="Aumentar resolução"
                shortcut="U"
                color="text-teal-600"
                bgColor="bg-teal-500/15"
                onClick={() => handleAITool(onAddUpscaleNode)}
              />
              <AIToolItem
                icon={<EraserIcon className="size-4" strokeWidth={1.8} />}
                label="Remover Fundo"
                description="Isolar o objeto principal"
                shortcut="R"
                color="text-rose-600"
                bgColor="bg-rose-500/15"
                onClick={() => handleAITool(onAddRemoveBgNode)}
              />

              <div className="h-px bg-border mx-2 my-1" />

              <AIToolItem
                icon={<VideoIcon className="size-4" strokeWidth={1.8} />}
                label="Gerar Vídeo"
                description="Imagem para vídeo"
                shortcut="V"
                color="text-orange-600"
                bgColor="bg-orange-500/15"
                onClick={() => handleAITool(onAddImageToVideoNode)}
              />
              <AIToolItem
                icon={
                  <PersonStandingIcon className="size-4" strokeWidth={1.8} />
                }
                label="Transferir Movimento"
                description="Aplicar movimento de vídeo em imagem"
                shortcut="M"
                color="text-pink-600"
                bgColor="bg-pink-500/15"
                onClick={() => handleAITool(onAddMotionControlNode)}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
