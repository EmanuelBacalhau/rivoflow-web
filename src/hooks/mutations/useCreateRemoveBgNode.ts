import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { NodeService } from "@/services/node/node-service";
import { RemoveBgNodeService } from "@/services/node/remove-bg-node-service";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";

interface CreateRemoveBgNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isPendingDelete?: (tempId: string) => boolean;
  onPendingDelete?: (realNodeId: string, flowId: string) => void;
}

export function useCreateRemoveBgNodeController({
  updateNodes,
  isPendingDelete,
  onPendingDelete,
}: CreateRemoveBgNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createRemoveBgNode"],
    mutationFn: async (paramsNode: RemoveBgNodeService.CreateParams) => {
      const response = await RemoveBgNodeService.create(paramsNode);
      return response.node;
    },
    onMutate: async (paramsNode) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      updateNodes((nds) =>
        nds.concat({
          id: tempId,
          type: NodeTypeEnum.GENERATION_REMOVE_BG,
          position: paramsNode.position,
          data: {
            status: GenerationStatusEnum.PENDING,
            attempts: 0,
            outputNodeId: null,
            consumedCredits: 0,
            creditsRequired: 0,
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
              type: node.nodeType,
              position: n.position,
              data: {
                ...node.data,
                ...n.data,
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
      toast.error("Erro ao criar nó de remoção de fundo. Tente novamente.");
    },
  });

  return {
    createRemoveBgNode: mutateAsync,
  };
}
