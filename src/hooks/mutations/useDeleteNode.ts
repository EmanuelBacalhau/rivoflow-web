import { useMutation } from "@tanstack/react-query";
import { NodeService } from "@/services/node/node-service";

export function useDeleteNodeController() {
  const { mutateAsync } = useMutation({
    mutationKey: ["deleteNode"],
    mutationFn: async (paramsNode: NodeService.DeleteNodeParams) => {
      await NodeService.delete(paramsNode);
    },
  });

  return {
    deleteNode: mutateAsync,
  };
}
