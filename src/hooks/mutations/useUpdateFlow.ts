import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/providers/main-provider";
import { FlowService } from "@/services/flow-service";

export function useUpdateFlow() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: FlowService.updateTitle,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["flows"],
      });
    },
  });

  return {
    updateFlow: mutateAsync,
    isFlowUpdating: isPending,
  };
}
