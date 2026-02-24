"use client";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { useFlow } from "@/contexts/flow-context";
import { FlowLoading } from "./flow-loading";
import { KeyboardShortcuts } from "./layout/keyboard-shortcuts";
import { Toolbar } from "./layout/toolbar";
import { AIGeneratorNode } from "./nodes/ai-generator-image-node";
import { PromptNode } from "./nodes/prompt-node";
import { ResultImageNode } from "./nodes/result-image-node";
import { UploadImageNode } from "./nodes/upload-image-node";
import { useSidebar } from "./ui/sidebar";

const nodeTypes = {
  PROMPT: PromptNode,
  IMAGE: UploadImageNode,
  GENERATION_IMAGE: AIGeneratorNode,
  RESULT_IMAGE: ResultImageNode,
};

const PRO_OPTIONS = { hideAttribution: true };

export function FlowCanvas() {
  const {
    isLoading,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addPromptNode,
    addImageNode,
    addGenerationImageNode,
  } = useFlow();
  const { isMobile } = useSidebar();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key.toLocaleLowerCase() === "p") addPromptNode();
      if (e.key.toLocaleLowerCase() === "i") addImageNode();
      if (e.key.toLocaleLowerCase() === "g") addGenerationImageNode();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addPromptNode, addImageNode, addGenerationImageNode]);

  if (isLoading) {
    return <FlowLoading />;
  }

  return (
    <div className="h-screen relative">
      <Toolbar
        onAddPromptNode={addPromptNode}
        onAddImageNode={addImageNode}
        onAddGenerationImageNode={addGenerationImageNode}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        proOptions={PRO_OPTIONS}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={2}
          className="bg-background!"
        />
      </ReactFlow>

      {!isMobile && <KeyboardShortcuts />}
    </div>
  );
}
