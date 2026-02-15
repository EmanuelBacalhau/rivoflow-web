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
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ImageNodeService } from "@/services/node/ImageNodeService";
import { NodeService } from "@/services/node/NodeService";
import { NodeTypeEnum } from "@/services/node/types";
import { debounce } from "@/utils/debounce";
import { useCreateNodeGenerationImageController } from "./controllers/generation-image/create";
import { useCreateNodeImageController } from "./controllers/image/create";
import { useUploadImageNodeController } from "./controllers/image/upload";
import { useCreateNodePromptController } from "./controllers/prompt/create";
import { useCreateEdgeController } from "./controllers/useCreateEdge";
import { useDeleteEdgesController } from "./controllers/useDeleteEdge";
import { useDeleteNodeController } from "./controllers/useDeleteNode";
import { useUpdateNodePositionController } from "./controllers/useUpdatePosition";

const MAX_IMAGE_NODES = 14;

const NODE_COLORS: Record<string, string> = {
  PROMPT: "#f59e0b", // amber
  IMAGE: "#3b82f6", // blue
  GENERATION_IMAGE: "#a855f7", // purple
  RESULT: "#22c55e", // green
};

interface ConnectedData {
  prompts: string[];
  images: string[];
  videos: string[];
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
  getConnectedData: (nodeId: string) => ConnectedData;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { id: flowId } = useParams<{ id: string }>();

  const { data } = useQuery({
    queryKey: ["flow", flowId],
    queryFn: () => NodeService.getNodesByFlowId(flowId),
  });

  useEffect(() => {
    if (data?.nodes) {
      const mappedNodes = data.nodes.map((node) => ({
        ...node,
        type: node.data.type,
      }));
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
  const { createImageNode } = useCreateNodeImageController({
    updateNodes: setNodes,
  });
  const { createGenerationImageNode } = useCreateNodeGenerationImageController({
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
        updatePositionNodeDebounced({
          nodeId,
          flowId,
          nodeType: node.type as NodeTypeEnum,
          position: change.position,
        });
      }

      if (change.type === "remove") {
        const nodeId = change.id;
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) return;

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

  const addPromptNode = async () => {
    const position = {
      x: 0,
      y: 0,
    };

    await createPromptNode({
      position: position,
      flowId,
    });
  };

  const addImageNode = async () => {
    const position = {
      x: 0,
      y: 0,
    };

    await createImageNode({
      position: position,
      flowId,
    });
  };

  const addGenerationImageNode = async () => {
    const position = {
      x: 0,
      y: 0,
    };

    await createGenerationImageNode({
      position: position,
      flowId,
    });
  };

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node,
        ),
      );
    },
    [],
  );

  const getConnectedData = useCallback(
    (nodeId: string): ConnectedData => {
      const prompts: string[] = [];
      const images: string[] = [];
      const videos: string[] = [];

      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (!sourceNode) continue;

        const isPromptNode =
          sourceNode.type === NodeTypeEnum.PROMPT && sourceNode.data?.prompt;
        const isImageNode =
          sourceNode.type === NodeTypeEnum.IMAGE && sourceNode.data?.imageUrl;
        const isResultNode =
          sourceNode.type === NodeTypeEnum.RESULT && sourceNode.data?.imageUrl;

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

      return { prompts, images, videos };
    },
    [edges, nodes],
  );

  return (
    <FlowContext.Provider
      value={{
        flowId,
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addPromptNode,
        addImageNode,
        addGenerationImageNode,
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
