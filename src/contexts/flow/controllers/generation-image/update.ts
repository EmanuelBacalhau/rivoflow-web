import { useMutation } from "@tanstack/react-query";
import { GenerationImageNodeService } from "@/services/node/GenerationImageNodeService";

export function useUpdateDataGenerationImageNodeController() {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateGenerationImageNode"],
    mutationFn: async (params: GenerationImageNodeService.UpdateParams) => {
      await GenerationImageNodeService.update(params);
    },
  });

  return {
    updateGenerationImageNode: mutateAsync,
  };
}
