import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import { NodeService } from "@/services/node/node-service";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";

interface CreateNodeGenerationImageParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isPendingDelete?: (tempId: string) => boolean;
  onPendingDelete?: (realNodeId: string, flowId: string) => void;
}

export function useCreateNodeGenerationImageController({
  updateNodes,
  isPendingDelete,
  onPendingDelete,
}: CreateNodeGenerationImageParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createGenerationImageNode"],
    mutationFn: async (paramsNode: GenerationImageNodeService.CreateParams) => {
      const response = await GenerationImageNodeService.create(paramsNode);
      return response.node;
    },
    onMutate: async (paramsNode) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      updateNodes((nds) =>
        nds.concat({
          id: tempId,
          type: NodeTypeEnum.GENERATION_IMAGE,
          position: paramsNode.position,
          data: {
            type: NodeTypeEnum.GENERATION_IMAGE,
            parameters: {
              aspectRatio: "1:1",
              quality: "1K",
            },
            status: GenerationStatusEnum.PENDING,
            isExecuted: false,
          },
        }),
      );

      return { tempId, originalPosition: paramsNode.position };
    },
    onSuccess: (node, params, context) => {
      if (context?.tempId && isPendingDelete?.(context.tempId)) {
        updateNodes((nds) => nds.filter((n) => n.id !== node.id));
        onPendingDelete?.(node.id, params.flowId);
        return;
      }

      let currentPosition = node.position;

      updateNodes((nds) =>
        nds.map((n) => {
          if (n.id === context?.tempId) {
            currentPosition = n.position;
            return {
              id: node.id,
              type: node.data.type,
              position: n.position,
              data: {
                ...node.data,
                ...n.data,
                type: node.data.type,
                isExecuted: node.isExecuted,
              },
            };
          }
          return n;
        }),
      );

      const positionChanged =
        currentPosition.x !== context?.originalPosition.x ||
        currentPosition.y !== context?.originalPosition.y;

      if (positionChanged) {
        NodeService.updatePosition({
          nodeId: node.id,
          flowId: params.flowId,
          position: currentPosition,
        });
      }
    },
    onError: (_, __, context) => {
      if (context?.tempId) {
        updateNodes((nds) => nds.filter((n) => n.id !== context.tempId));
      }
      toast.error("Erro ao criar nó de geração. Tente novamente.");
    },
  });

  return {
    createGenerationImageNode: mutateAsync,
  };
}
