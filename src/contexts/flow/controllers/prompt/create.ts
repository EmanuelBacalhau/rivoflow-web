import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { PromptNodeService } from "@/services/node/PromptNodeService";

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
    createPromptNode: mutateAsync,
  };
}
