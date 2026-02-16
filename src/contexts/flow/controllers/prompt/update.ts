import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { PromptNodeService } from "@/services/node/PromptNodeService";

interface UpdateDataPromptNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateDataPromptNodeController({
  updateNodes,
}: UpdateDataPromptNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updatePromptNode"],
    mutationFn: async (params: PromptNodeService.UpdateParams) => {
      await PromptNodeService.update(params);
    },
    onMutate: async (params) => {
      // Atualiza UI imediatamente (optimistic)
      updateNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === params.nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...params.data,
                },
              }
            : n,
        ),
      );
    },
  });

  return {
    updatePromptNode: mutateAsync,
  };
}
