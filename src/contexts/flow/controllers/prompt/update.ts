import { useMutation } from "@tanstack/react-query";
import { PromptNodeService } from "@/services/node/PromptNodeService";

export function useUpdateDataPromptNodeController() {
  const { mutateAsync } = useMutation({
    mutationKey: ["updatePromptNode"],
    mutationFn: async (params: PromptNodeService.UpdateParams) => {
      await PromptNodeService.update(params);
    },
  });

  return {
    updatePromptNode: mutateAsync,
  };
}
