"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { useParams } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useCreateNodeGenerationImageController } from "@/hooks/flow/generation-image/create";
import { useGenerateImageController } from "@/hooks/flow/generation-image/generate";
import { useUpdateDataGenerationImageNodeController } from "@/hooks/flow/generation-image/update";
import { useCreateNodeImageController } from "@/hooks/flow/image/create";
import { useUploadImageNodeController } from "@/hooks/flow/image/upload";
import { useCreateNodePromptController } from "@/hooks/flow/prompt/create";
import { useUpdateDataPromptNodeController } from "@/hooks/flow/prompt/update";
import { useCreateEdgeController } from "@/hooks/flow/useCreateEdge";
import { useDeleteEdgesController } from "@/hooks/flow/useDeleteEdge";
import { useDeleteNodeController } from "@/hooks/flow/useDeleteNode";
import { useUpdateNodePositionController } from "@/hooks/flow/useUpdatePosition";
import type { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";
import type { ImageNodeService } from "@/services/node/ImageNodeService";
import { NodeService } from "@/services/node/NodeService";
import type { PromptNodeService } from "@/services/node/PromptNodeService";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";
import { debounce } from "@/utils/debounce";

const NODE_COLORS: Record<string, string> = {
  PROMPT: "#f59e0b", // amber
  IMAGE: "#3b82f6", // blue
  GENERATION_IMAGE: "#a855f7", // purple
  RESULT_IMAGE: "#22c55e", // green
};

interface ConnectedData {
  prompts: string[];
  images: string[];
  nodesSynced: string[];
}

interface FlowContextType {
  flowId: string;
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  addPromptNode: () => void;
  addImageNode: () => void;
  addGenerationImageNode: () => void;
  uploadImageNode: (
    params: ImageNodeService.UploadImageParams,
  ) => Promise<ImageNodeService.UploadImageResponse>;
  updatePromptNode: (params: PromptNodeService.UpdateParams) => Promise<void>;
  updateGenerationImageNode: (
    params: GenerationImageNodeService.UpdateParams,
  ) => Promise<void>;
  generateImageNode: (
    params: GenerationImageNodeService.GenerateImageParams,
  ) => Promise<void>;
  isLoading: boolean;
  getConnectedData: (nodeId: string) => ConnectedData;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { id: flowId } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["flow", flowId],
    queryFn: () => NodeService.getNodesByFlowId(flowId),
    refetchInterval: (query) => {
      const hasProcessingNodes = query.state.data?.nodes.some((node) => {
        if (node.data.type !== NodeTypeEnum.GENERATION_IMAGE) return false;
        const generationNode = node as GenerationImageNodeService.Node;

        const isQueued =
          generationNode.data.status === GenerationStatusEnum.QUEUED;
        const isProcessing =
          generationNode.data.status === GenerationStatusEnum.PROCESSING;

        return isProcessing || isQueued;
      });

      return hasProcessingNodes ? 5000 : false;
    },
  });

  useEffect(() => {
    if (data?.nodes) {
      const mappedNodes = data.nodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            isExecuted: node.isExecuted,
          },
          type: node.data.type,
        };
      });
      const mappedEdges = data.edges.map((edge) => {
        const sourceNode = mappedNodes.find((n) => n.id === edge.sourceNodeId);
        const strokeColor = NODE_COLORS[sourceNode?.type || ""] || "#6b7280";

        return {
          id: edge.id,
          source: edge.sourceNodeId,
          target: edge.targetNodeId,
          animated: true,
          style: { stroke: strokeColor, strokeWidth: 2 },
        };
      });

      setNodes(mappedNodes);
      setEdges(mappedEdges);
    }
  }, [data]);

  const { createPromptNode } = useCreateNodePromptController({
    updateNodes: setNodes,
  });
  const { updatePromptNode } = useUpdateDataPromptNodeController({
    updateNodes: setNodes,
  });
  const { createImageNode } = useCreateNodeImageController({
    updateNodes: setNodes,
  });
  const { createGenerationImageNode } = useCreateNodeGenerationImageController({
    updateNodes: setNodes,
  });
  const { updateGenerationImageNode } =
    useUpdateDataGenerationImageNodeController({
      updateNodes: setNodes,
    });
  const { generateImageNode } = useGenerateImageController({
    flowId,
    updateNodes: setNodes,
  });

  const { updatePositionNode } = useUpdateNodePositionController();
  const { uploadImageNode } = useUploadImageNodeController({
    updateNodes: setNodes,
  });

  const updatePositionNodeDebounced = debounce(updatePositionNode, 300);

  const { deleteNode } = useDeleteNodeController();

  const { createEdge } = useCreateEdgeController({
    updateEdges: setEdges,
  });
  const { deleteEdges } = useDeleteEdgesController();

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

    changes.forEach((change) => {
      if (change.type === "position" && change.position) {
        const nodeId = change.id;
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        if (nodeId.startsWith("temp-")) return;

        updatePositionNodeDebounced({
          nodeId,
          flowId,
          position: change.position,
        });
      }

      if (change.type === "remove") {
        const nodeId = change.id;
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

        if (nodeId.startsWith("temp-")) return;

        deleteNode({
          nodeId,
          flowId,
        });
      }
    });
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));
    const edgesForDelete = changes
      .filter((change) => change.type === "remove")
      .map((edge) => ({
        edgeId: edge.id,
        flowId,
      }));

    if (edgesForDelete.length > 0) {
      deleteEdges({
        edges: edgesForDelete,
      });
    }
  };

  const onConnect = (params: Connection) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const strokeColor = NODE_COLORS[sourceNode?.type || ""] || "#6b7280";

    const targetNode = nodes.find((n) => n.id === params.target);

    if (
      targetNode &&
      targetNode.type === NodeTypeEnum.GENERATION_IMAGE &&
      targetNode.data.isExecuted
    ) {
      alert("Cannot connect from an executed generation image node.");
      return;
    }

    createEdge({
      flowId,
      sourceNodeId: params.source,
      targetNodeId: params.target,
    });

    setEdges((edgesSnapshot) =>
      addEdge(
        {
          ...params,
          animated: true,
          style: { stroke: strokeColor, strokeWidth: 2 },
        },
        edgesSnapshot,
      ),
    );
  };

  const addPromptNode = () => {
    const position = {
      x: 0,
      y: 0,
    };

    createPromptNode({
      position: position,
      flowId,
    });
  };

  const addImageNode = () => {
    const position = {
      x: 0,
      y: 0,
    };

    createImageNode({
      position: position,
      flowId,
    });
  };

  const addGenerationImageNode = () => {
    const position = {
      x: 0,
      y: 0,
    };

    createGenerationImageNode({
      position: position,
      flowId,
    });
  };

  const updateNodeData = (nodeId: string, data: Record<string, unknown>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node,
      ),
    );
  };

  const getConnectedData = (nodeId: string): ConnectedData => {
    const nodesSynced: string[] = [];
    const prompts: string[] = [];
    const images: string[] = [];

    const incomingEdges = edges.filter((edge) => edge.target === nodeId);

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;

      nodesSynced.push(sourceNode.id);

      const isPromptNode =
        sourceNode.type === NodeTypeEnum.PROMPT && sourceNode.data?.prompt;
      const isImageNode =
        sourceNode.type === NodeTypeEnum.IMAGE && sourceNode.data?.imageUrl;
      const isResultNode =
        sourceNode.type === NodeTypeEnum.RESULT_IMAGE &&
        sourceNode.data?.imageUrl;

      if (isPromptNode) {
        prompts.push(sourceNode.data.prompt as string);
      }

      if (isImageNode) {
        images.push(sourceNode.data.imageUrl as string);
      }

      if (isResultNode) {
        images.push(sourceNode.data.imageUrl as string);
      }
    }

    return { prompts, images, nodesSynced };
  };

  return (
    <FlowContext.Provider
      value={{
        flowId,
        isLoading,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addPromptNode,
        addImageNode,
        addGenerationImageNode,
        updatePromptNode,
        updateGenerationImageNode,
        generateImageNode,
        getConnectedData,
        updateNodeData,
        uploadImageNode,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
}
