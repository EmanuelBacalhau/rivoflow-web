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
      let previousData: Record<string, unknown> = {};

      updateNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === params.nodeId) {
            previousData = n.data as Record<string, unknown>;
            return { ...n, data: { ...n.data, ...params.data } };
          }
          return n;
        }),
      );

      return { nodeId: params.nodeId, previousData };
    },
    onError: (error, _, context) => {
      if (isAxiosError(error) && error.response?.status === 404) return;

      if (context?.previousData) {
        updateNodes((nds) =>
          nds.map((n) =>
            n.id === context.nodeId ? { ...n, data: context.previousData } : n,
          ),
        );
      }

      toast.error("Erro ao salvar o prompt. Tente novamente.");
    },
  });

  return {
    updatePromptNode: mutateAsync,
  };
}
