import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/main-provider";
import { FlowService } from "@/services/flow-service";

export function useCreateFlow() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: FlowService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["flows"],
      });
    },
  });

  return {
    createFlow: mutateAsync,
    isCreatingFlow: isPending,
  };
}
