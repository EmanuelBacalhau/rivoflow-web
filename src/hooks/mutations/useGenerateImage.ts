import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { TriggerGenerationService } from "@/services/node/trigger-generation-service";
import { GENERATION_NODE_TYPES, GenerationStatusEnum } from "@/types";

type GenerateImageControllerParams = {
  flowId: string;
  updateNodes: Dispatch<SetStateAction<Node[]>>;
  onGenerateSuccess?: (nodeId: string) => void;
};

export function useGenerateImageController({
  updateNodes,
  onGenerateSuccess,
}: GenerateImageControllerParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["generateImageNode"],
    mutationFn: async (
      paramsNode: TriggerGenerationService.GenerateImageParams,
    ) => {
      await TriggerGenerationService.generate(paramsNode);
      return paramsNode.nodeGeneratorId;
    },
    onMutate: async (
      paramsNode: TriggerGenerationService.GenerateImageParams,
    ) => {
      const { nodeGeneratorId } = paramsNode;
      updateNodes((nds) =>
        nds.map((n) => {
          const isGenerationNode = GENERATION_NODE_TYPES.includes(
            n.type as (typeof GENERATION_NODE_TYPES)[number],
          );
          if (n.id === nodeGeneratorId && isGenerationNode) {
            return {
              ...n,
              data: {
                ...n.data,
                isExecuted: true,
                status: GenerationStatusEnum.PROCESSING,
              },
            };
          }
          return n;
        }),
      );
    },
    onSuccess: (nodeId) => {
      onGenerateSuccess?.(nodeId);
    },
    onError: (
      _error,
      paramsNode: TriggerGenerationService.GenerateImageParams,
    ) => {
      const { nodeGeneratorId } = paramsNode;
      updateNodes((nds) =>
        nds.map((n) => {
          const isGenerationNode = GENERATION_NODE_TYPES.includes(
            n.type as (typeof GENERATION_NODE_TYPES)[number],
          );
          if (n.id === nodeGeneratorId && isGenerationNode) {
            return {
              ...n,
              data: {
                ...n.data,
                isExecuted: false,
                status: GenerationStatusEnum.PENDING,
              },
            };
          }
          return n;
        }),
      );
      toast.error("Erro ao gerar. Tente novamente.");
    },
  });

  return {
    generateImageNode: mutateAsync,
  };
}
