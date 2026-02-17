import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";

interface UpdateDataGenerationImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateDataGenerationImageNodeController({
  updateNodes,
}: UpdateDataGenerationImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateGenerationImageNode"],
    mutationFn: async (params: GenerationImageNodeService.UpdateParams) => {
      await GenerationImageNodeService.update(params);
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
    onError: () => {
      toast.error("Erro ao atualizar configurações do gerador.");
    },
  });

  return {
    updateGenerationImageNode: mutateAsync,
  };
}
