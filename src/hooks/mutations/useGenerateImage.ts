import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { queryClient } from "@/providers/main-provider";
import { GenerationImageNodeService } from "@/services/node/generation-image-node-service";
import { GenerationStatusEnum, NodeTypeEnum } from "@/types";

type GenerateImageControllerParams = {
  flowId: string;
  updateNodes: Dispatch<SetStateAction<Node[]>>;
};

export function useGenerateImageController({
  flowId,
  updateNodes,
}: GenerateImageControllerParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["generateImageNode"],
    mutationFn: async (
      paramsNode: GenerationImageNodeService.GenerateImageParams,
    ) => {
      await GenerationImageNodeService.generate(paramsNode);
    },
    onMutate: async (
      paramsNode: GenerationImageNodeService.GenerateImageParams,
    ) => {
      const { nodeGeneratorId } = paramsNode;
      updateNodes((nds) =>
        nds.map((n) =>
          n.id === nodeGeneratorId && n.type === NodeTypeEnum.GENERATION_IMAGE
            ? {
                ...n,
                data: {
                  ...n.data,
                  isExecuted: true,
                  status: GenerationStatusEnum.PROCESSING,
                },
              }
            : n,
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flow", flowId] });
    },
    onError: (
      _error,
      paramsNode: GenerationImageNodeService.GenerateImageParams,
    ) => {
      const { nodeGeneratorId } = paramsNode;
      updateNodes((nds) =>
        nds.map((n) =>
          n.id === nodeGeneratorId && n.type === NodeTypeEnum.GENERATION_IMAGE
            ? {
                ...n,
                data: {
                  ...n.data,
                  isExecuted: false,
                },
              }
            : n,
        ),
      );
      toast.error("Erro ao gerar imagem. Tente novamente.");
    },
  });

  return {
    generateImageNode: mutateAsync,
  };
}
