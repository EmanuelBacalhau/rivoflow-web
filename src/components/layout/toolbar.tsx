"use client";

import {
  ImagePlusIcon,
  MessageCircleMoreIcon,
  SparklesIcon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface ToolbarProps {
  onAddPromptNode: () => void;
  onAddImageNode: () => void;
  onAddGenerationImageNode: () => void;
}

interface NodeButtonProps {
  icon: React.ReactNode;
  label: string;
  iconColor: string;
  onClick: () => void;
  isMobile?: boolean;
}

function NodeButton({
  icon,
  label,
  iconColor,
  onClick,
  isMobile,
}: NodeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center ${isMobile ? "gap-1 px-2 py-1" : "gap-2 px-3 py-2"} rounded-lg transition-all hover:shadow-sm hover:bg-muted`}
    >
      <span className={`shrink-0 ${iconColor}`}>{icon}</span>
      <span className="text-xs font-medium text-white">{label}</span>
    </button>
  );
}

export function Toolbar({
  onAddPromptNode,
  onAddImageNode,
  onAddGenerationImageNode,
}: ToolbarProps) {
  const { isMobile } = useSidebar();

  return (
    <Card
      className={`absolute top-4 ${isMobile ? "left-4 right-4" : "left-1/2 -translate-x-1/2"} z-10 flex items-center gap-1 backdrop-blur-sm p-1.5 rounded-xl shadow-lg`}
    >
      <CardContent className="items-center">
        {isMobile && <SidebarTrigger />}

        <div className="flex items-center">
          {/* Label */}
          <span className="text-[10px] font-semibold text-white uppercase tracking-wider px-1 mr-1">
            Nós
          </span>

          <Separator
            orientation="vertical"
            className={isMobile ? "h-4!" : "h-6!"}
          />

          <div className="flex items-center gap-1 ">
            {/* Prompt */}
            <NodeButton
              icon={<MessageCircleMoreIcon className="size-3.5" />}
              label="Prompt"
              iconColor="text-amber-600"
              onClick={onAddPromptNode}
              isMobile={isMobile}
            />

            {/* Image */}
            <NodeButton
              icon={<ImagePlusIcon className="size-3.5" />}
              label="Imagem"
              iconColor="text-blue-600"
              onClick={onAddImageNode}
              isMobile={isMobile}
            />

            <Separator
              orientation="vertical"
              className={isMobile ? "h-4!" : "h-6!"}
            />

            {/* Generator */}
            <NodeButton
              icon={<SparklesIcon className="size-3.5" />}
              label="Gerar Imagem"
              iconColor="text-purple-600"
              onClick={onAddGenerationImageNode}
              isMobile={isMobile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
