import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";

interface CreateNodeGenerationImageParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useCreateNodeGenerationImageController({
  updateNodes,
}: CreateNodeGenerationImageParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["createGenerationImageNode"],
    mutationFn: async (paramsNode: GenerationImageNodeService.CreateParams) => {
      const response = await GenerationImageNodeService.create(paramsNode);
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
    createGenerationImageNode: mutateAsync,
  };
}
