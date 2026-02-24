import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { EdgeService } from "@/services/edge-service";
import { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import { NodeTypeEnum } from "@/types";

type DeleteEdgeParams = {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
};

export function useDeleteEdgeController({ updateNodes }: DeleteEdgeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["deleteEdge"],
    mutationFn: async (
      paramsEdge: EdgeService.DeleteParams & { node: Node },
    ) => {
      await EdgeService.delete(paramsEdge);
    },
    onMutate: async (paramsEdge) => {
      if (paramsEdge.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
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
      if (paramsEdge.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
        const nodeId = paramsEdge.node.id;
        try {
          const result = await GenerationImageNodeService.calculateCredits({
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
      if (paramsEdge.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
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
