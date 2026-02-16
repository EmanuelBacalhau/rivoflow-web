import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/main-provider";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";

export function useGenerateImageController(flowId: string) {
  const { mutateAsync } = useMutation({
    mutationKey: ["generateImageNode"],
    mutationFn: async (
      paramsNode: GenerationImageNodeService.GenerateImageParams,
    ) => {
      await GenerationImageNodeService.generate(paramsNode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flow", flowId] });
    },
  });

  return {
    generateImageNode: mutateAsync,
  };
}
