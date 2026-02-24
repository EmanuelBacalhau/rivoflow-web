import { useMutation } from "@tanstack/react-query";
import type { Edge, Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { EdgeService } from "@/services/edge-service";
import { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import { NodeTypeEnum } from "@/types";

type CreateEdgeParams = {
  updateEdges: Dispatch<SetStateAction<Edge[]>>;
  updateNodes: Dispatch<SetStateAction<Node[]>>;
};

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
      if (params.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
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

      if (params.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
        const nodeId = params.node.id;
        // isCalculatingCredits is already true from onMutate
        try {
          const result = await GenerationImageNodeService.calculateCredits({
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
      if (params.node.data.type === NodeTypeEnum.GENERATION_IMAGE) {
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
