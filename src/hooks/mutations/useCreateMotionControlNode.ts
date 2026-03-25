import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { MotionControlNodeService } from "@/services/node/motion-control-node-service";
import { NodeService } from "@/services/node/node-service";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";

interface CreateMotionControlNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isPendingDelete?: (tempId: string) => boolean;
  onPendingDelete?: (realNodeId: string, flowId: string) => void;
}

export function useCreateMotionControlNodeController({
  updateNodes,
  isPendingDelete,
  onPendingDelete,
}: CreateMotionControlNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createMotionControlNode"],
    mutationFn: async (paramsNode: MotionControlNodeService.CreateParams) => {
      const response = await MotionControlNodeService.create(paramsNode);
      return response.node;
    },
    onMutate: async (paramsNode) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      updateNodes((nds) =>
        nds.concat({
          id: tempId,
          type: NodeTypeEnum.GENERATION_MOTION_CONTROL,
          position: paramsNode.position,
          data: {
            keepOriginalSound: true,
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
      toast.error("Erro ao criar nó de motion control. Tente novamente.");
    },
  });

  return {
    createMotionControlNode: mutateAsync,
  };
}
