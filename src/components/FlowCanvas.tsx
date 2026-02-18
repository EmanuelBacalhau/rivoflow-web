"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import { useEffect } from "react";
import { useFlow } from "@/contexts/flow";
import { FlowLoading } from "./FlowLoading";
import { Toolbar } from "./layout/Toolbar";
import { AIGeneratorNode } from "./nodes/AIGeneratorImageNode";
import { PromptNode } from "./nodes/PromptNode";
import { ResultImageNode } from "./nodes/ResultImageNode";
import { UploadImageNode } from "./nodes/UploadImageNode";

const nodeTypes = {
  PROMPT: PromptNode,
  IMAGE: UploadImageNode,
  GENERATION_IMAGE: AIGeneratorNode,
  RESULT_IMAGE: ResultImageNode,
};

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.key === "p" || e.key === "P") addPromptNode();
      if (e.key === "i" || e.key === "I") addImageNode();
      if (e.key === "g" || e.key === "G") addGenerationImageNode();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [addPromptNode, addImageNode, addGenerationImageNode]);

  if (isLoading) {
    return <FlowLoading />;
  }

  return (
    <div className="h-screen bg-gray-50">
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
        proOptions={{ hideAttribution: true }}
        fitView
        className="bg-gray-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={2}
          color="#d1d5db"
        />

        <Controls className="bg-white rounded-lg shadow-lg border border-gray-200" />
      </ReactFlow>
    </div>
  );
}
