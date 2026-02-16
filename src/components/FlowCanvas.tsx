"use client";

import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from "@xyflow/react";
import { useFlow } from "@/contexts/flow";
import { AIGeneratorNode } from "./nodes/AIGeneratorImageNode";
import { PromptNode } from "./nodes/PromptNode";
import { ResultNode } from "./nodes/ResultNode";
import { UploadImageNode } from "./nodes/UploadImageNode";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";

const nodeTypes = {
  PROMPT: PromptNode,
  IMAGE: UploadImageNode,
  GENERATION_IMAGE: AIGeneratorNode,
  RESULT: ResultNode,
};

export function FlowCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addPromptNode,
    addImageNode,
    addGenerationImageNode,
  } = useFlow();

  return (
    <div className="h-screen bg-gray-50">
      <Sidebar />

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
          size={3}
          color="#d1d5db"
        />

        <Controls className="bg-white rounded-lg shadow-lg border border-gray-200" />
      </ReactFlow>
    </div>
  );
}
