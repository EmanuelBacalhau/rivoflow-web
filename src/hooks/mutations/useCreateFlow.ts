import { useMutation } from "@tanstack/react-query";
import { FlowService } from "@/services/FlowService";

export function useCreateFlow() {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: FlowService.create,
  });

  return {
    createFlow: mutateAsync,
    isCreatingFlow: isPending,
  };
}
