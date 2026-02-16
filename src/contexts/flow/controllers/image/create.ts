import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { ImageNodeService } from "@/services/node/ImageNodeService";
import { NodeService } from "@/services/node/NodeService";
import { NodeTypeEnum } from "@/services/node/types";

interface CreateNodeImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useCreateNodeImageController({
  updateNodes,
}: CreateNodeImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createImageNode"],
    mutationFn: async (paramsNode: ImageNodeService.CreateParams) => {
      const response = await ImageNodeService.create(paramsNode);
      return response.node;
    },
    onMutate: async (paramsNode) => {
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      updateNodes((nds) =>
        nds.concat({
          id: tempId,
          type: NodeTypeEnum.IMAGE,
          position: paramsNode.position,
          data: {
            type: NodeTypeEnum.IMAGE,
            key: "",
            imageUrl: "",
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
          nodeType: NodeTypeEnum.IMAGE,
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
    createImageNode: mutateAsync,
  };
}
