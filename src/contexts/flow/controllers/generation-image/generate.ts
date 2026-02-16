import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import type { Dispatch, SetStateAction } from "react";
import { queryClient } from "@/providers/main-provider";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";
import { NodeTypeEnum } from "@/services/node/types";

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
    onMutate: async () => {
      updateNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isExecuted: true,
            status:
              n.type === NodeTypeEnum.GENERATION_IMAGE
                ? GenerationImageNodeService.GenerationStatusEnum.PROCESSING
                : n.data.status,
          },
        })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flow", flowId] });
    },
    onError: () => {
      updateNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: {
            ...n.data,
            isExecuted: false,
          },
        })),
      );
    },
  });

  return {
    generateImageNode: mutateAsync,
  };
}
