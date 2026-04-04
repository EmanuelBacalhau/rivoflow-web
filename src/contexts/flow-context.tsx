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
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useCreateEdgeController } from "@/hooks/mutations/useCreateEdge";
import { useCreateNodeGenerationImageController } from "@/hooks/mutations/useCreateGenerationImageNode";
import { useCreateNodeImageController } from "@/hooks/mutations/useCreateImageNode";
import { useCreateImageToVideoNodeController } from "@/hooks/mutations/useCreateImageToVideoNode";
import { useCreateMotionControlNodeController } from "@/hooks/mutations/useCreateMotionControlNode";
import { useCreateNodePromptController } from "@/hooks/mutations/useCreatePromptNode";
import { useCreateRemoveBgNodeController } from "@/hooks/mutations/useCreateRemoveBgNode";
import { useCreateTextToImageNodeController } from "@/hooks/mutations/useCreateTextToImageNode";
import { useCreateUpscaleNodeController } from "@/hooks/mutations/useCreateUpscaleNode";
import { useCreateVideoNodeController } from "@/hooks/mutations/useCreateVideoNode";
import { useDeleteEdgeController } from "@/hooks/mutations/useDeleteEdge";
import { useDeleteNodeController } from "@/hooks/mutations/useDeleteNode";
import { useGenerateImageController } from "@/hooks/mutations/useGenerateImage";
import { useUpdateDataGenerationImageNodeController } from "@/hooks/mutations/useUpdateGenerationImageNode";
import { useUpdateImageToVideoNodeController } from "@/hooks/mutations/useUpdateImageToVideoNode";
import { useUpdateMotionControlNodeController } from "@/hooks/mutations/useUpdateMotionControlNode";
import { useUpdateNodePositionController } from "@/hooks/mutations/useUpdateNodePosition";
import { useUpdateDataPromptNodeController } from "@/hooks/mutations/useUpdatePromptNode";
import { useUpdateTextToImageNodeController } from "@/hooks/mutations/useUpdateTextToImageNode";
import { useUpdateUpscaleNodeController } from "@/hooks/mutations/useUpdateUpscaleNode";
import { useUploadImageNodeController } from "@/hooks/mutations/useUploadImageNode";
import { useFlowNodes } from "@/hooks/queries/useFlowNodes";
import { NODE_COLORS } from "@/lib/node-colors";
import { queryClient } from "@/providers/main-provider";
import type { FileNodeService } from "@/services/node/file-node-service";
import type { ImageToVideoNodeService } from "@/services/node/image-to-video-node-service";
import type { MotionControlNodeService } from "@/services/node/motion-control-node-service";
import { NodeService } from "@/services/node/node-service";
import type { PromptNodeService } from "@/services/node/prompt-node-service";
import type { TextToImageNodeService } from "@/services/node/text-to-image-node-service";
import { TriggerGenerationService } from "@/services/node/trigger-generation-service";
import type { UpscaleNodeService } from "@/services/node/upscale-node-service";
import {
  GENERATION_NODE_TYPES,
  GenerationStatusEnum,
  NodeTypeEnum,
} from "@/types";
import { debounce } from "@/utils/debounce";

interface ConnectedData {
  prompts: string[];
  images: string[];
  videos: string[];
  videoDurations: (number | null)[];
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
  addTextToImageNode: () => void;
  addUpscaleNode: () => void;
  addRemoveBgNode: () => void;
  addVideoNode: () => void;
  addImageToVideoNode: () => void;
  addMotionControlNode: () => void;
  uploadImageNode: (
    params: FileNodeService.UploadParams,
  ) => Promise<FileNodeService.UploadResponse>;
  updatePromptNode: (params: PromptNodeService.UpdateParams) => Promise<void>;
  updateGenerationImageNode: (
    params: TriggerGenerationService.UpdateParams,
  ) => Promise<void>;
  updateTextToImageNode: (
    params: TextToImageNodeService.UpdateParams,
  ) => Promise<void>;
  updateUpscaleNode: (params: UpscaleNodeService.UpdateParams) => Promise<void>;
  updateImageToVideoNode: (
    params: ImageToVideoNodeService.UpdateParams,
  ) => Promise<void>;
  updateMotionControlNode: (
    params: MotionControlNodeService.UpdateParams,
  ) => Promise<void>;
  generateImageNode: (
    params: TriggerGenerationService.GenerateImageParams,
  ) => Promise<string>;
  calculateCreditsForNode: (nodeId: string) => Promise<void>;
  markConnectedGeneratorsAsCalculating: (sourceNodeId: string) => void;
  isLoading: boolean;
  getConnectedData: (nodeId: string) => ConnectedData;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  removeNode: (nodeId: string) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

function isGenerationNodeType(type: string | undefined): boolean {
  return GENERATION_NODE_TYPES.includes(type as NodeTypeEnum);
}

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
  const isDeletingNodeRef = useRef(false);
  const pendingDeleteRef = useRef<Set<string>>(new Set());
  const pollingIntervalsRef = useRef<
    Map<string, ReturnType<typeof setInterval>>
  >(new Map());

  const startStatusPolling = useCallback(
    (nodeId: string) => {
      if (pollingIntervalsRef.current.has(nodeId)) return;

      const poll = async () => {
        try {
          const { status, result } = await TriggerGenerationService.getStatus({
            flowId,
            nodeId,
          });

          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, status } } : n,
            ),
          );

          if (status === GenerationStatusEnum.COMPLETED && result) {
            pollingIntervalsRef.current.delete(nodeId);

            // Add result node directly to canvas
            const resultNodeExists = nodesRef.current.some(
              (n) => n.id === result.id,
            );
            if (!resultNodeExists) {
              setNodes((nds) => [
                ...nds,
                {
                  id: result.id,
                  type: result.nodeType,
                  position: result.position,
                  data: {
                    ...result.data,
                    isExecuted: result.isExecuted,
                  },
                },
              ]);

              // Add edge from generation node to result node
              const strokeColor =
                NODE_COLORS[
                  nodesRef.current.find((n) => n.id === nodeId)?.type || ""
                ] || "#6b7280";
              setEdges((eds) => [
                ...eds,
                {
                  id: `${nodeId}-${result.id}`,
                  source: nodeId,
                  target: result.id,
                  animated: true,
                  style: { stroke: strokeColor, strokeWidth: 2 },
                },
              ]);
            }

            queryClient.invalidateQueries({ queryKey: ["account"] });
            return;
          }

          if (status === GenerationStatusEnum.FAILED) {
            pollingIntervalsRef.current.delete(nodeId);

            // Reset generator and its source nodes so user can retry
            const sourceNodeIds = edgesRef.current
              .filter((e) => e.target === nodeId)
              .map((e) => e.source);

            setNodes((nds) =>
              nds.map((n) => {
                if (n.id === nodeId) {
                  return {
                    ...n,
                    data: {
                      ...n.data,
                      status: GenerationStatusEnum.PENDING,
                      isExecuted: false,
                    },
                  };
                }
                if (sourceNodeIds.includes(n.id)) {
                  return {
                    ...n,
                    data: { ...n.data, isExecuted: false },
                  };
                }
                return n;
              }),
            );

            toast.error("Erro interno na geração. Tente novamente.");
            return;
          }
        } catch {
          // silently ignore polling errors
        }

        // Schedule next poll: video nodes take longer
        const generationNode = nodesRef.current.find((n) => n.id === nodeId);
        const isVideoGeneration =
          generationNode?.type === "GENERATION_IMAGE_TO_VIDEO" ||
          generationNode?.type === "GENERATION_MOTION_CONTROL";
        const interval = isVideoGeneration ? 15000 : 5000;

        const nextTimeout = setTimeout(poll, interval);
        pollingIntervalsRef.current.set(nodeId, nextTimeout);
      };

      // Initial delay before first poll
      const generationNode = nodesRef.current.find((n) => n.id === nodeId);
      const isVideoGeneration =
        generationNode?.type === "GENERATION_IMAGE_TO_VIDEO" ||
        generationNode?.type === "GENERATION_MOTION_CONTROL";
      const initialDelay = isVideoGeneration ? 10000 : 3000;

      const timeout = setTimeout(poll, initialDelay);
      pollingIntervalsRef.current.set(nodeId, timeout);
    },
    [flowId],
  );

  const startMetadataPollingRef = useRef<(nodeId: string) => void>(() => {});
  startMetadataPollingRef.current = (nodeId: string) => {
    const key = `metadata-${nodeId}`;
    if (pollingIntervalsRef.current.has(key)) return;

    const poll = async () => {
      try {
        const { ready, duration } = await NodeService.getMetadata({
          flowId,
          nodeId,
        });

        if (ready && duration != null) {
          pollingIntervalsRef.current.delete(key);

          setNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, duration } } : n,
            ),
          );

          getConnectedGeneratorNodeIds(nodeId).forEach(calculateCreditsForNode);
          return;
        }
      } catch {
        // silently ignore
      }

      const nextTimeout = setTimeout(poll, 3000);
      pollingIntervalsRef.current.set(key, nextTimeout);
    };

    const timeout = setTimeout(poll, 2000);
    pollingIntervalsRef.current.set(key, timeout);
  };

  useEffect(() => {
    return () => {
      for (const timeout of pollingIntervalsRef.current.values()) {
        clearTimeout(timeout);
      }
      pollingIntervalsRef.current.clear();
    };
  }, []);

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
          type: node.nodeType,
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

      for (const node of data.nodes) {
        if (GENERATION_NODE_TYPES.includes(node.nodeType)) {
          const nodeData = node.data as { status?: string };
          if (
            nodeData.status === GenerationStatusEnum.QUEUED ||
            nodeData.status === GenerationStatusEnum.PROCESSING
          ) {
            startStatusPolling(node.id);
          }
        }

        if (node.nodeType === NodeTypeEnum.VIDEO) {
          const nodeData = node.data as {
            videoUrl?: string;
            duration?: number;
          };
          if (nodeData.videoUrl && !nodeData.duration) {
            startMetadataPollingRef.current(node.id);
          }
        }
      }
    }
  }, [data, startStatusPolling]);

  const { deleteNode } = useDeleteNodeController();

  const isPendingDelete = (tempId: string) =>
    pendingDeleteRef.current.has(tempId);

  const onPendingDelete = (realNodeId: string, nodeFlowId: string) => {
    deleteNode({ nodeId: realNodeId, flowId: nodeFlowId });
  };

  const isDeleted = (nodeId: string) => deletedNodeIdsRef.current.has(nodeId);

  const calculateCreditsForNode = async (nodeId: string) => {
    if (deletedNodeIdsRef.current.has(nodeId)) return;
    if (!nodesRef.current.some((n) => n.id === nodeId)) return;

    setNodes((nds) =>
      nds.map((n) =>
        n.id === nodeId
          ? { ...n, data: { ...n.data, isCalculatingCredits: true } }
          : n,
      ),
    );

    try {
      const result = await TriggerGenerationService.calculateCredits({
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
      .filter((n): n is Node => isGenerationNodeType(n?.type))
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

  // --- Prompt ---
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

  // --- Image (file upload) ---
  const { createImageNode } = useCreateNodeImageController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });

  // --- Generation Image (image-to-image) ---
  const { createGenerationImageNode } = useCreateNodeGenerationImageController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updateGenerationImageNode } =
    useUpdateDataGenerationImageNodeController({
      updateNodes: setNodes,
    });

  // --- Text to Image ---
  const { createTextToImageNode } = useCreateTextToImageNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updateTextToImageNode } = useUpdateTextToImageNodeController({
    updateNodes: setNodes,
  });

  // --- Upscale ---
  const { createUpscaleNode } = useCreateUpscaleNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updateUpscaleNode } = useUpdateUpscaleNodeController({
    updateNodes: setNodes,
  });

  // --- Remove BG ---
  const { createRemoveBgNode } = useCreateRemoveBgNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });

  // --- Video (upload) ---
  const { createVideoNode } = useCreateVideoNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });

  // --- Image to Video ---
  const { createImageToVideoNode } = useCreateImageToVideoNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updateImageToVideoNode } = useUpdateImageToVideoNodeController({
    updateNodes: setNodes,
  });

  // --- Motion Control ---
  const { createMotionControlNode } = useCreateMotionControlNodeController({
    updateNodes: setNodes,
    isPendingDelete,
    onPendingDelete,
  });
  const { updateMotionControlNode } = useUpdateMotionControlNodeController({
    updateNodes: setNodes,
  });

  // --- Generate (shared for all generation types) ---
  const resetSourceNodes = (nodeGeneratorId: string) => {
    const sourceNodeIds = edgesRef.current
      .filter((e) => e.target === nodeGeneratorId)
      .map((e) => e.source);

    if (sourceNodeIds.length > 0) {
      setNodes((nds) =>
        nds.map((n) =>
          sourceNodeIds.includes(n.id)
            ? { ...n, data: { ...n.data, isExecuted: false } }
            : n,
        ),
      );
    }
  };

  const { generateImageNode: _generateImageNode } = useGenerateImageController({
    flowId,
    updateNodes: setNodes,
    onGenerateSuccess: startStatusPolling,
    onGenerateError: resetSourceNodes,
  });

  const generateImageNode = async (
    params: TriggerGenerationService.GenerateImageParams,
  ) => {
    // Mark all source nodes connected to this generator as executed
    const sourceNodeIds = edgesRef.current
      .filter((e) => e.target === params.nodeGeneratorId)
      .map((e) => e.source);

    if (sourceNodeIds.length > 0) {
      setNodes((nds) =>
        nds.map((n) =>
          sourceNodeIds.includes(n.id)
            ? { ...n, data: { ...n.data, isExecuted: true } }
            : n,
        ),
      );
    }

    return _generateImageNode(params);
  };

  const { updatePositionNode } = useUpdateNodePositionController();

  const { uploadImageNode: _uploadImageNode } = useUploadImageNodeController({
    updateNodes: setNodes,
    isDeleted,
    onUploadComplete: (nodeId, isVideo) => {
      if (isVideo) {
        startMetadataPollingRef.current(nodeId);
      } else {
        getConnectedGeneratorNodeIds(nodeId).forEach(calculateCreditsForNode);
      }
    },
  });

  const uploadImageNode = (
    params: FileNodeService.UploadParams,
  ): Promise<FileNodeService.UploadResponse> => {
    return _uploadImageNode(params);
  };

  const updatePositionNodeDebouncedRef = useRef(
    debounce(updatePositionNode, 300),
  );

  const { createEdge } = useCreateEdgeController({
    updateEdges: setEdges,
    updateNodes: setNodes,
  });
  const { deleteEdge } = useDeleteEdgeController({
    updateNodes: setNodes,
    isNodeDeleted: isDeleted,
  });

  const onNodesChange = (changes: NodeChange[]) => {
    // Collect node IDs to delete BEFORE applying changes (nodes still exist in state)
    const nodesToDelete: string[] = [];
    for (const change of changes) {
      if (change.type === "remove") {
        deletedNodeIdsRef.current.add(change.id);
        nodesToDelete.push(change.id);
      }
    }

    // Apply changes to local state (this removes the nodes from nodesRef)
    setNodes((nodesSnapshot) => {
      const updated = applyNodeChanges(changes, nodesSnapshot);
      nodesRef.current = updated;
      return updated;
    });

    // Handle position updates
    for (const change of changes) {
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
    }

    // Handle deletions (using IDs collected before state update)
    for (const nodeId of nodesToDelete) {
      if (nodeId.startsWith("temp-")) {
        pendingDeleteRef.current.add(nodeId);
        continue;
      }

      deleteNode({
        nodeId,
        flowId,
      }).catch(() => {
        toast.error("Erro ao deletar nó. Tente novamente.");
      });
    }
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    const edgesToDelete: {
      edgeId: string;
      source: string;
      target: string;
    }[] = [];
    for (const change of changes) {
      if (change.type === "remove") {
        const edge = edgesRef.current.find((e) => e.id === change.id);
        if (edge) {
          edgesToDelete.push({
            edgeId: change.id,
            source: edge.source,
            target: edge.target,
          });
        }
      }
    }

    setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot));

    if (edgesToDelete.length === 0) return;
    queueMicrotask(() => {
      for (const { edgeId, source, target } of edgesToDelete) {
        if (deletedNodeIdsRef.current.has(source)) continue;
        if (deletedNodeIdsRef.current.has(target)) continue;

        const targetNode = nodesRef.current.find((n) => n.id === target);
        if (!targetNode) continue;

        deleteEdge({ edgeId, flowId, node: targetNode }).catch(() => {
          toast.error("Erro ao deletar conexão. Tente novamente.");
        });
      }
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

    const isSourcePrompt = sourceNode.type === NodeTypeEnum.PROMPT;
    const isSourceImage =
      sourceNode.type === NodeTypeEnum.IMAGE ||
      sourceNode.type === NodeTypeEnum.RESULT_IMAGE;
    const isSourceVideo =
      sourceNode.type === NodeTypeEnum.VIDEO ||
      sourceNode.type === NodeTypeEnum.RESULT_VIDEO;
    const isSourceGeneration = isGenerationNodeType(sourceNode.type);
    const isTargetGeneration = isGenerationNodeType(targetNode.type);

    if (!isTargetGeneration) {
      toast.error("Só é possível conectar a um node de geração.");
      return;
    }

    if (isSourceGeneration) {
      toast.error("Não é permitido conectar dois nodes de geração entre si.");
      return;
    }

    if (targetNode.data.isExecuted) {
      toast.error(
        "Não é permitido conectar a um node de geração já executado.",
      );
      return;
    }

    const incomingEdges = edges.filter((e) => e.target === params.target);
    let imageCount = 0;
    let promptCount = 0;
    let videoCount = 0;

    for (const edge of incomingEdges) {
      const n = nodes.find((nd) => nd.id === edge.source);
      if (!n) continue;
      if (n.type === NodeTypeEnum.IMAGE || n.type === NodeTypeEnum.RESULT_IMAGE)
        imageCount++;
      else if (n.type === NodeTypeEnum.PROMPT) promptCount++;
      else if (
        n.type === NodeTypeEnum.VIDEO ||
        n.type === NodeTypeEnum.RESULT_VIDEO
      )
        videoCount++;
    }

    const targetType = targetNode.type;

    if (targetType === NodeTypeEnum.GENERATION_TEXT_TO_IMAGE) {
      if (isSourceImage || isSourceVideo) {
        toast.error("Este node aceita apenas Texto.");
        return;
      }
      if (isSourcePrompt && promptCount >= 1) {
        toast.error("Este node aceita apenas 1 texto.");
        return;
      }
    }

    if (targetType === NodeTypeEnum.GENERATION_IMAGE_EDIT) {
      if (isSourceVideo) {
        toast.error("Este node não aceita vídeos.");
        return;
      }
      if (isSourceImage && imageCount >= 14) {
        toast.error("Este node aceita no máximo 14 imagens.");
        return;
      }
      if (isSourcePrompt && promptCount >= 1) {
        toast.error("Este node aceita apenas 1 texto.");
        return;
      }
    }

    if (targetType === NodeTypeEnum.GENERATION_UPSCALE) {
      if (isSourcePrompt || isSourceVideo) {
        toast.error("Este node aceita apenas Imagem.");
        return;
      }
      if (isSourceImage && imageCount >= 1) {
        toast.error("Este node aceita apenas 1 imagem.");
        return;
      }
    }

    if (targetType === NodeTypeEnum.GENERATION_REMOVE_BG) {
      if (isSourcePrompt || isSourceVideo) {
        toast.error("Este node aceita apenas Imagem.");
        return;
      }
      if (isSourceImage && imageCount >= 1) {
        toast.error("Este node aceita apenas 1 imagem.");
        return;
      }
    }

    if (targetType === NodeTypeEnum.GENERATION_IMAGE_TO_VIDEO) {
      if (isSourceVideo) {
        toast.error("Este node não aceita vídeos.");
        return;
      }
      const isPremium = targetNode.data.tier === "premium";
      const maxImages = isPremium ? 2 : 1;
      if (isSourceImage && imageCount >= maxImages) {
        toast.error(
          isPremium
            ? "Este node aceita no máximo 2 imagens (start e end frame)."
            : "No modo Padrão, apenas 1 imagem. Use Premium para 2.",
        );
        return;
      }
      if (isSourcePrompt && promptCount >= 1) {
        toast.error("Este node aceita apenas 1 texto.");
        return;
      }
    }

    if (targetType === NodeTypeEnum.GENERATION_MOTION_CONTROL) {
      if (isSourceVideo && videoCount >= 1) {
        toast.error("Este node aceita apenas 1 vídeo.");
        return;
      }
      if (isSourceImage && imageCount >= 1) {
        toast.error("Este node aceita apenas 1 imagem.");
        return;
      }
      if (isSourcePrompt && promptCount >= 1) {
        toast.error("Este node aceita apenas 1 texto.");
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

  const addVideoNode = () => {
    createVideoNode({
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

  const addTextToImageNode = () => {
    createTextToImageNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addUpscaleNode = () => {
    createUpscaleNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addRemoveBgNode = () => {
    createRemoveBgNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addImageToVideoNode = () => {
    createImageToVideoNode({
      position: getViewportCenter(),
      flowId,
    });
  };

  const addMotionControlNode = () => {
    createMotionControlNode({
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
    deletedNodeIdsRef.current.add(nodeId);
    isDeletingNodeRef.current = true;
    onNodesChange([{ type: "remove", id: nodeId }]);
    isDeletingNodeRef.current = false;
  };

  const getConnectedData = (nodeId: string): ConnectedData => {
    const nodesSynced: string[] = [];
    const prompts: string[] = [];
    const images: string[] = [];
    const videos: string[] = [];
    const videoDurations: (number | null)[] = [];

    const incomingEdges = edges.filter((edge) => edge.target === nodeId);

    for (const edge of incomingEdges) {
      const sourceNode = nodes.find((n) => n.id === edge.source);
      if (!sourceNode) continue;

      nodesSynced.push(sourceNode.id);

      const isPromptNode =
        sourceNode.type === NodeTypeEnum.PROMPT && sourceNode.data?.prompt;
      const isImageNode =
        sourceNode.type === NodeTypeEnum.IMAGE && sourceNode.data?.imageUrl;
      const isVideoUploadNode =
        sourceNode.type === NodeTypeEnum.VIDEO && sourceNode.data?.videoUrl;
      const isResultImageNode =
        sourceNode.type === NodeTypeEnum.RESULT_IMAGE &&
        sourceNode.data?.imageUrl;
      const isResultVideoNode =
        sourceNode.type === NodeTypeEnum.RESULT_VIDEO &&
        sourceNode.data?.videoUrl;

      if (isPromptNode) {
        prompts.push(sourceNode.data.prompt as string);
      }

      if (isImageNode) {
        images.push(sourceNode.data.imageUrl as string);
      }

      if (isVideoUploadNode) {
        videos.push(sourceNode.data.videoUrl as string);
        videoDurations.push((sourceNode.data.duration as number) ?? null);
      }

      if (isResultImageNode) {
        images.push(sourceNode.data.imageUrl as string);
      }

      if (isResultVideoNode) {
        videos.push(sourceNode.data.videoUrl as string);
        videoDurations.push((sourceNode.data.duration as number) ?? null);
      }
    }

    return { prompts, images, videos, videoDurations, nodesSynced };
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
        addTextToImageNode,
        addUpscaleNode,
        addRemoveBgNode,
        addVideoNode,
        addImageToVideoNode,
        addMotionControlNode,
        updatePromptNode,
        updateGenerationImageNode,
        updateTextToImageNode,
        updateUpscaleNode,
        updateImageToVideoNode,
        updateMotionControlNode,
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
