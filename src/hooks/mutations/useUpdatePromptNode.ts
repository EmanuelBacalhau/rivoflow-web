import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { PromptNodeService } from "@/services/node/prompt-node-service";

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
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) return;
      toast.error("Erro ao salvar o prompt. Tente novamente.");
    },
  });

  return {
    updatePromptNode: mutateAsync,
  };
}
