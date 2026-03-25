import { useMutation } from "@tanstack/react-query";
import type { Edge, Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { EdgeService } from "@/services/edge-service";
import { TriggerGenerationService } from "@/services/node/trigger-generation-service";
import { GENERATION_NODE_TYPES } from "@/types";

type CreateEdgeParams = {
  updateEdges: Dispatch<SetStateAction<Edge[]>>;
  updateNodes: Dispatch<SetStateAction<Node[]>>;
};

function isGenerationNode(node: Node): boolean {
  return GENERATION_NODE_TYPES.includes(
    node.type as (typeof GENERATION_NODE_TYPES)[number],
  );
}

export function useCreateEdgeController({
  updateEdges,
  updateNodes,
}: CreateEdgeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createEdge"],
    mutationFn: async (
      paramsEdge: EdgeService.CreateParams & {
        node: Node;
      },
    ) => {
      const response = await EdgeService.create(paramsEdge);
      return response.edge;
    },
    onMutate: async (params) => {
      if (isGenerationNode(params.node)) {
        const nodeId = params.node.id;
        updateNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, isCalculatingCredits: true } }
              : n,
          ),
        );
      }
    },
    onSuccess: async (edge, params) => {
      const { sourceNodeId, targetNodeId, id } = edge;

      updateEdges((prevEdges) => {
        return prevEdges.map((e) =>
          e.source === sourceNodeId && e.target === targetNodeId
            ? {
                ...e,
                id: id,
                source: sourceNodeId,
                target: targetNodeId,
              }
            : e,
        );
      });

      if (isGenerationNode(params.node)) {
        const nodeId = params.node.id;
        try {
          const result = await TriggerGenerationService.calculateCredits({
            flowId: params.flowId,
            nodeId,
          });
          updateNodes((nds) =>
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
          updateNodes((nds) =>
            nds.map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, isCalculatingCredits: false } }
                : n,
            ),
          );
        }
      }
    },
    onError: (_error, params) => {
      if (isGenerationNode(params.node)) {
        const nodeId = params.node.id;
        updateNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, isCalculatingCredits: false } }
              : n,
          ),
        );
      }
    },
  });

  return {
    createEdge: mutateAsync,
  };
}
