import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { TriggerGenerationService } from "@/services/node/trigger-generation-service";

interface UpdateDataGenerationImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateDataGenerationImageNodeController({
  updateNodes,
}: UpdateDataGenerationImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateGenerationImageNode"],
    mutationFn: async (params: TriggerGenerationService.UpdateParams) => {
      await TriggerGenerationService.update(params);
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
      toast.error("Erro ao atualizar configurações do gerador.");
    },
  });

  return {
    updateGenerationImageNode: mutateAsync,
  };
}
