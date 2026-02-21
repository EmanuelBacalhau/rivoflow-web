import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { NodeService } from "@/services/node/node-service";
import { PromptNodeService } from "@/services/node/prompt-node-service";
import { NodeTypeEnum } from "@/types";

interface CreateNodePromptParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  isPendingDelete?: (tempId: string) => boolean;
  onPendingDelete?: (realNodeId: string, flowId: string) => void;
}

export function useCreateNodePromptController({
  updateNodes,
  isPendingDelete,
  onPendingDelete,
}: CreateNodePromptParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createPromptNode"],
    mutationFn: async (paramsNode: PromptNodeService.CreateParams) => {
      const response = await PromptNodeService.create(paramsNode);
      return response.node;
    },
    onMutate: async (paramsNode) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      updateNodes((nds) =>
        nds.concat({
          id: tempId,
          type: NodeTypeEnum.PROMPT,
          position: paramsNode.position,
          data: {
            type: NodeTypeEnum.PROMPT,
            prompt: "",
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
      toast.error("Erro ao criar nó de prompt. Tente novamente.");
    },
  });

  return {
    createPromptNode: mutateAsync,
  };
}
