import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { ImageNodeService } from "@/services/node/ImageNodeService";

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
    onSuccess: (node) => {
      updateNodes((nds) =>
        nds.concat({
          id: node.id,
          type: node.data.type,
          position: node.position,
          data: {
            isExecuted: node.isExecuted,
            ...node.data,
          },
        }),
      );
    },
  });

  return {
    createImageNode: mutateAsync,
  };
}
