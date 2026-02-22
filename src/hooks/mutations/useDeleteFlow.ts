import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/main-provider";
import { FlowService } from "@/services/flow-service";

export function useDeleteFlow() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: FlowService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["flows"],
      });
    },
  });

  return {
    deleteFlow: mutateAsync,
    isFlowDeleting: isPending,
  };
}
