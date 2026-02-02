"use client";

import type {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
} from "@xyflow/react";
import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const MAX_IMAGE_NODES = 14;

const NODE_COLORS: Record<string, string> = {
  prompt: "#f59e0b", // amber
  image: "#3b82f6", // blue
  aiGenerator: "#a855f7", // purple
  result: "#22c55e", // green
};

interface ConnectedData {
  prompts: string[];
  images: string[];
  videos: string[];
}

interface FlowContextType {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Connection) => void;
  addPromptNode: () => void;
  addImageNode: () => void;
  addAIGeneratorNode: () => void;
  addResultNode: (sourceNodeId: string, imageUrl: string) => void;
  addVideoResultNode: (sourceNodeId: string, videoUrl: string) => void;
  imageNodeCount: number;
  maxImageNodes: number;
  getConnectedData: (nodeId: string) => ConnectedData;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [nodeIdCounter, setNodeIdCounter] = useState(1);

  const imageNodeCount = useMemo(() => {
    return nodes.filter((node) => node.type === "image").length;
  }, [nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const strokeColor = NODE_COLORS[sourceNode?.type || ""] || "#6b7280";

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
    },
    [nodes],
  );

  const getNewNodeId = useCallback(() => {
    const id = `node-${nodeIdCounter}`;
    setNodeIdCounter((prev) => prev + 1);
    return id;
  }, [nodeIdCounter]);

  const getViewportCenter = useCallback(() => {
    const randomOffset = () => Math.random() * 100 - 50;
    return {
      x: 200 + randomOffset(),
      y: 200 + randomOffset(),
    };
  }, []);

  const addPromptNode = useCallback(() => {
    const position = getViewportCenter();
    const newNode: Node = {
      id: getNewNodeId(),
      type: "prompt",
      position,
      data: { prompt: "" },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNewNodeId, getViewportCenter]);

  const addImageNode = useCallback(() => {
    if (imageNodeCount >= MAX_IMAGE_NODES) return;

    const position = getViewportCenter();
    const newNode: Node = {
      id: getNewNodeId(),
      type: "image",
      position,
      data: { imageUrl: "", file: null },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNewNodeId, getViewportCenter, imageNodeCount]);

  const addAIGeneratorNode = useCallback(() => {
    const position = getViewportCenter();
    const newNode: Node = {
      id: getNewNodeId(),
      type: "aiGenerator",
      position,
      data: { format: "" },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNewNodeId, getViewportCenter]);

  const addVideoGeneratorNode = useCallback(() => {
    const position = getViewportCenter();
    const newNode: Node = {
      id: getNewNodeId(),
      type: "videoGenerator",
      position,
      data: {},
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNewNodeId, getViewportCenter]);

  const addUploadVideoNode = useCallback(() => {
    const position = getViewportCenter();
    const newNode: Node = {
      id: getNewNodeId(),
      type: "uploadVideo",
      position,
      data: { videoUrl: "" },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [getNewNodeId, getViewportCenter]);

  const addResultNode = useCallback(
    (sourceNodeId: string, imageUrl: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      const newNodeId = getNewNodeId();
      const newNode: Node = {
        id: newNodeId,
        type: "result",
        position: {
          x: sourceNode.position.x + 350,
          y: sourceNode.position.y,
        },
        data: { imageUrl },
      };

      const newEdge: Edge = {
        id: `${sourceNodeId}-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: NODE_COLORS.aiGenerator, strokeWidth: 2 },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
    },
    [nodes, getNewNodeId],
  );

  const addVideoResultNode = useCallback(
    (sourceNodeId: string, videoUrl: string) => {
      const sourceNode = nodes.find((n) => n.id === sourceNodeId);
      if (!sourceNode) return;

      const newNodeId = getNewNodeId();
      const newNode: Node = {
        id: newNodeId,
        type: "videoResult",
        position: {
          x: sourceNode.position.x + 350,
          y: sourceNode.position.y,
        },
        data: { videoUrl },
      };

      const newEdge: Edge = {
        id: `${sourceNodeId}-${newNodeId}`,
        source: sourceNodeId,
        target: newNodeId,
        animated: true,
        style: { stroke: NODE_COLORS.videoGenerator, strokeWidth: 2 },
      };

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat(newEdge));
    },
    [nodes, getNewNodeId],
  );

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

        // Prompts
        if (sourceNode.type === "prompt" && sourceNode.data?.prompt) {
          prompts.push(sourceNode.data.prompt as string);
        }
        // Imagens de UploadImageNode
        else if (sourceNode.type === "image" && sourceNode.data?.imageUrl) {
          images.push(sourceNode.data.imageUrl as string);
        }
        // Imagens de ResultNode
        else if (sourceNode.type === "result" && sourceNode.data?.imageUrl) {
          images.push(sourceNode.data.imageUrl as string);
        }
      }

      return { prompts, images, videos };
    },
    [edges, nodes],
  );

  const value = useMemo(
    () => ({
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addPromptNode,
      addImageNode,
      addAIGeneratorNode,
      addVideoGeneratorNode,
      addUploadVideoNode,
      addResultNode,
      addVideoResultNode,
      imageNodeCount,
      maxImageNodes: MAX_IMAGE_NODES,
      getConnectedData,
      updateNodeData,
    }),
    [
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onConnect,
      addPromptNode,
      addImageNode,
      addAIGeneratorNode,
      addVideoGeneratorNode,
      addUploadVideoNode,
      addResultNode,
      addVideoResultNode,
      imageNodeCount,
      getConnectedData,
      updateNodeData,
    ],
  );

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

export function useFlow() {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
}
