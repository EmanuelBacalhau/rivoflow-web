"use client";

import { Background, BackgroundVariant, ReactFlow } from "@xyflow/react";
import { useEffect } from "react";
import { useFlow } from "@/contexts/flow-context";
import { FlowLoading } from "./flow-loading";
import { Toolbar } from "./layout/toolbar";
import { AIGeneratorNode } from "./nodes/ai-generator-image-node";
import { ImageToVideoNode } from "./nodes/image-to-video-node";
import { MotionControlNode } from "./nodes/motion-control-node";
import { PromptNode } from "./nodes/prompt-node";
import { RemoveBgNode } from "./nodes/remove-bg-node";
import { ResultImageNode } from "./nodes/result-image-node";
import { ResultVideoNode } from "./nodes/result-video-node";
import { TextToImageNode } from "./nodes/text-to-image-node";
import { UploadImageNode } from "./nodes/upload-image-node";
import { UploadVideoNode } from "./nodes/upload-video-node";
import { UpscaleNode } from "./nodes/upscale-node";

const nodeTypes = {
  PROMPT: PromptNode,
  IMAGE: UploadImageNode,
  VIDEO: UploadVideoNode,
  GENERATION_IMAGE_EDIT: AIGeneratorNode,
  GENERATION_TEXT_TO_IMAGE: TextToImageNode,
  GENERATION_UPSCALE: UpscaleNode,
  GENERATION_REMOVE_BG: RemoveBgNode,
  GENERATION_IMAGE_TO_VIDEO: ImageToVideoNode,
  GENERATION_MOTION_CONTROL: MotionControlNode,
  RESULT_IMAGE: ResultImageNode,
  RESULT_VIDEO: ResultVideoNode,
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
    addTextToImageNode,
    addUpscaleNode,
    addRemoveBgNode,
    addVideoNode,
    addImageToVideoNode,
    addMotionControlNode,
  } = useFlow();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const key = e.key.toLocaleLowerCase();
      if (key === "p") addPromptNode();
      if (key === "i") addImageNode();
      if (key === "o") addVideoNode();
      if (key === "g") addGenerationImageNode();
      if (key === "t") addTextToImageNode();
      if (key === "u") addUpscaleNode();
      if (key === "r") addRemoveBgNode();
      if (key === "v") addImageToVideoNode();
      if (key === "m") addMotionControlNode();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    addPromptNode,
    addImageNode,
    addVideoNode,
    addGenerationImageNode,
    addTextToImageNode,
    addUpscaleNode,
    addRemoveBgNode,
    addImageToVideoNode,
    addMotionControlNode,
  ]);

  if (isLoading) {
    return <FlowLoading />;
  }

  return (
    <div className="h-screen relative">
      <Toolbar
        onAddPromptNode={addPromptNode}
        onAddImageNode={addImageNode}
        onAddGenerationImageNode={addGenerationImageNode}
        onAddTextToImageNode={addTextToImageNode}
        onAddUpscaleNode={addUpscaleNode}
        onAddRemoveBgNode={addRemoveBgNode}
        onAddVideoNode={addVideoNode}
        onAddImageToVideoNode={addImageToVideoNode}
        onAddMotionControlNode={addMotionControlNode}
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
          size={1}
          className="bg-background!"
        />
      </ReactFlow>
    </div>
  );
}
