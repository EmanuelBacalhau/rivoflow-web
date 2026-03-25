import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { EdgeService } from "@/services/edge-service";
import { TriggerGenerationService } from "@/services/node/trigger-generation-service";
import { GENERATION_NODE_TYPES } from "@/types";

type DeleteEdgeParams = {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isNodeDeleted?: (nodeId: string) => boolean;
};

function isGenerationNode(node: Node): boolean {
  return GENERATION_NODE_TYPES.includes(
    node.type as (typeof GENERATION_NODE_TYPES)[number],
  );
}

export function useDeleteEdgeController({
  updateNodes,
  isNodeDeleted,
}: DeleteEdgeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["deleteEdge"],
    mutationFn: async (
      paramsEdge: EdgeService.DeleteParams & { node: Node },
    ) => {
      await EdgeService.delete(paramsEdge);
    },
    onMutate: async (paramsEdge) => {
      if (
        isGenerationNode(paramsEdge.node) &&
        !isNodeDeleted?.(paramsEdge.node.id)
      ) {
        const nodeId = paramsEdge.node.id;
        updateNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId
              ? { ...n, data: { ...n.data, isCalculatingCredits: true } }
              : n,
          ),
        );
      }
    },
    onSuccess: async (_, paramsEdge) => {
      if (
        isGenerationNode(paramsEdge.node) &&
        !isNodeDeleted?.(paramsEdge.node.id)
      ) {
        const nodeId = paramsEdge.node.id;
        try {
          const result = await TriggerGenerationService.calculateCredits({
            flowId: paramsEdge.flowId,
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
    onError: (_, paramsEdge) => {
      if (
        isGenerationNode(paramsEdge.node) &&
        !isNodeDeleted?.(paramsEdge.node.id)
      ) {
        const nodeId = paramsEdge.node.id;
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
    deleteEdge: mutateAsync,
  };
}
