import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { NodeService } from "@/services/node/NodeService";
import { PromptNodeService } from "@/services/node/PromptNodeService";
import { NodeTypeEnum } from "@/services/node/types";

interface CreateNodePromptParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useCreateNodePromptController({
  updateNodes,
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
                ...node.data,  // Dados do servidor primeiro
                ...n.data,     // Sobrescreve com dados da UI (mudanças do usuário)
                type: node.data.type,  // Garante que type vem do servidor
                isExecuted: node.isExecuted,  // Garante que isExecuted vem do servidor
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
          nodeType: NodeTypeEnum.PROMPT,
          position: currentPosition,
        });
      }
    },
    onError: (_, __, context) => {
      if (context?.tempId) {
        updateNodes((nds) => nds.filter((n) => n.id !== context.tempId));
      }
    },
  });

  return {
    createPromptNode: mutateAsync,
  };
}
