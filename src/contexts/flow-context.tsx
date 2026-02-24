"use client";

import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import { useParams, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useCreateEdgeController } from "@/hooks/mutations/useCreateEdge";
import { useCreateNodeGenerationImageController } from "@/hooks/mutations/useCreateGenerationImageNode";
import { useCreateNodeImageController } from "@/hooks/mutations/useCreateImageNode";
import { useCreateNodePromptController } from "@/hooks/mutations/useCreatePromptNode";
import { useDeleteEdgeController } from "@/hooks/mutations/useDeleteEdge";
import { useDeleteNodeController } from "@/hooks/mutations/useDeleteNode";
import { useGenerateImageController } from "@/hooks/mutations/useGenerateImage";
import { useUpdateDataGenerationImageNodeController } from "@/hooks/mutations/useUpdateGenerationImageNode";
import { useUpdateNodePositionController } from "@/hooks/mutations/useUpdateNodePosition";
import { useUpdateDataPromptNodeController } from "@/hooks/mutations/useUpdatePromptNode";
import { useUploadImageNodeController } from "@/hooks/mutations/useUploadImageNode";
import { useFlowNodes } from "@/hooks/queries/useFlowNodes";
import { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import type { ImageNodeService } from "@/services/node/image-node-service";
import type { PromptNodeService } from "@/services/node/prompt-node-service";
import { NodeTypeEnum } from "@/types";
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
  calculateCreditsForNode: (nodeId: string) => Promise<void>;
  markConnectedGeneratorsAsCalculating: (sourceNodeId: string) => void;
  isLoading: boolean;
  getConnectedData: (nodeId: string) => ConnectedData;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  removeNode: (nodeId: string) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { id: flowId } = useParams<{ id: string }>();
  const router = useRouter();
  const { screenToFlowPosition } = useReactFlow();

  const getViewportCenter = () =>
    screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

  const nodesRef = useRef<Node[]>([]);
  const edgesRef = useRef<Edge[]>([]);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  const deletedNodeIdsRef = useRef<Set<string>>(new Set());
  const pendingDeleteRef = useRef<Set<string>>(new Set());

  const { data, isLoading, isError } = useFlowNodes({ flowId });

  useEffect(() => {
    if (isError) {
      router.replace("/dashboard");
    }
  }, [isError, router]);

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

  const { deleteNode } = useDeleteNodeController();

  const isPendingDelete = (tempId: string) =>
    pendingDeleteRef.current.has(tempId);

  const onPendingDelete = (realNodeId: string, nodeFlowId: string) => {
    deleteNode({ nodeId: realNodeId, flowId: nodeFlowId });
  };

  const isDeleted = (nodeId: string) => deletedNodeIdsRef.current.has(nodeId);

  const calculateCreditsForNode = async (nodeId: string) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, isCalculatingCredits: true } }
          : n,
      ),
    );

    try {
      const result = await GenerationImageNodeService.calculateCredits({
        nodeId,
        flowId,
      });

      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  creditsRequired: result.creditsRequired,
                  isCalculatingCredits: false,
                },
              }
            : n,
        ),
      );
    } catch {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, isCalculatingCredits: false } }
            : n,
        ),
      );
    }
  };

  const getConnectedGeneratorNodeIds = (sourceNodeId: string): string[] => {
    return edgesRef.current
      .filter((e) => e.source === sourceNodeId)
      .map((e) => nodesRef.current.find((n) => n.id === e.target))
      .filter((n): n is Node => n?.type === NodeTypeEnum.GENERATION_IMAGE)
      .map((n) => n.id);
  };

  const markConnectedGeneratorsAsCalculating = (sourceNodeId: string) => {
    const generatorNodeIds = getConnectedGeneratorNodeIds(sourceNodeId);
    if (generatorNodeIds.length === 0) return;

    setNodes((nds) =>
      nds.map((n) =>
        generatorNodeIds.includes(n.id)
          ? { ...n, data: { ...n.data, isCalculatingCredits: true } }
          : n,
      ),
    );
  };

  const { createPromptNode } = useCreateNodePromptController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updatePromptNode: _updatePromptNode } =
    useUpdateDataPromptNodeController({
      updateNodes: setNodes,
    });

  const updatePromptNode = async (
    params: PromptNodeService.UpdateParams,
  ): Promise<void> => {
    await _updatePromptNode(params);
    getConnectedGeneratorNodeIds(params.nodeId).forEach(
      calculateCreditsForNode,
    );
  };

  const { createImageNode } = useCreateNodeImageController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { createGenerationImageNode } = useCreateNodeGenerationImageController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
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

  const { uploadImageNode: _uploadImageNode } = useUploadImageNodeController({
    updateNodes: setNodes,
    isDeleted,
    onUploadComplete: (nodeId) => {
      getConnectedGeneratorNodeIds(nodeId).forEach(calculateCreditsForNode);
    },
  });

  const uploadImageNode = (
    params: ImageNodeService.UploadImageParams,
  ): Promise<ImageNodeService.UploadImageResponse> => {
    return _uploadImageNode(params);
  };

  const updatePositionNodeDebouncedRef = useRef(
    debounce(updatePositionNode, 300),
  );

  const { createEdge } = useCreateEdgeController({
    updateEdges: setEdges,
    updateNodes: setNodes,
  });
  const { deleteEdge } = useDeleteEdgeController({ updateNodes: setNodes });

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot));

    changes.forEach((change) => {
      if (change.type === "position" && change.position) {
        const nodeId = change.id;
        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (!node) return;

        if (nodeId.startsWith("temp-")) return;

        updatePositionNodeDebouncedRef.current({
          nodeId,
          flowId,
          position: change.position,
        });
      }

      if (change.type === "remove") {
        const nodeId = change.id;
        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (!node) return;

        if (nodeId.startsWith("temp-")) {
          pendingDeleteRef.current.add(nodeId);
          return;
        }

        deletedNodeIdsRef.current.add(nodeId);

        deleteNode({
          nodeId,
          flowId,
        }).catch(() => {
          toast.error("Erro ao deletar nó. Tente novamente.");
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

    edgesForDelete.forEach(({ edgeId, flowId }) => {
      const edge = edgesRef.current.find((e) => e.id === edgeId);
      if (!edge) return;
      const targetNode = nodesRef.current.find((n) => n.id === edge.target);
      if (!targetNode) return;

      deleteEdge({ edgeId, flowId, node: targetNode }).catch(() => {
        toast.error("Erro ao deletar conexão. Tente novamente.");
      });
    });
  };

  const onConnect = (params: Connection) => {
    const sourceNode = nodesRef.current.find((n) => n.id === params.source);

    if (!sourceNode) {
      toast.error("Node de origem não encontrado.");
      return;
    }

    const strokeColor = NODE_COLORS[sourceNode.type || ""] || "#6b7280";

    const targetNode = nodesRef.current.find((n) => n.id === params.target);

    if (!targetNode) {
      toast.error("Node de destino não encontrado.");
      return;
    }

    if (
      sourceNode.type === NodeTypeEnum.GENERATION_IMAGE &&
      targetNode.type === NodeTypeEnum.GENERATION_IMAGE
    ) {
      toast.error(
        "Não é permitido conectar um node de geração de imagem a outro node de geração de imagem.",
      );
      return;
    }

    if (
      targetNode.type === NodeTypeEnum.GENERATION_IMAGE &&
      targetNode.data.isExecuted
    ) {
      toast.error(
        "Não é permitido conectar um node a um node de geração de imagem já executado.",
      );
      return;
    }

    if (targetNode.type === NodeTypeEnum.GENERATION_IMAGE) {
      const incomingEdges = edges.filter((e) => e.target === params.target);

      let imageCount = 0;
      let promptCount = 0;

      for (const edge of incomingEdges) {
        const existingNode = nodes.find((n) => n.id === edge.source);
        if (
          existingNode?.type === NodeTypeEnum.IMAGE ||
          existingNode?.type === NodeTypeEnum.RESULT_IMAGE
        ) {
          imageCount++;
        } else if (existingNode?.type === NodeTypeEnum.PROMPT) {
          promptCount++;
        }
      }

      const isSourceImage =
        sourceNode.type === NodeTypeEnum.IMAGE ||
        sourceNode.type === NodeTypeEnum.RESULT_IMAGE;

      if (isSourceImage && imageCount >= 14) {
        toast.error("O node pode receber no máximo 14 imagens.");
        return;
      }

      if (sourceNode.type === NodeTypeEnum.PROMPT && promptCount >= 1) {
        toast.error("O node pode receber apenas 1 prompt.");
        return;
      }
    }

    createEdge({
      flowId,
      sourceNodeId: params.source,
      targetNodeId: params.target,
      node: targetNode,
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
    createPromptNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addImageNode = () => {
    createImageNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addGenerationImageNode = () => {
    createGenerationImageNode({
      position: getViewportCenter(),
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

  const removeNode = (nodeId: string) => {
    onNodesChange([{ type: "remove", id: nodeId }]);
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
        calculateCreditsForNode,
        markConnectedGeneratorsAsCalculating,
        getConnectedData,
        updateNodeData,
        uploadImageNode,
        removeNode,
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
