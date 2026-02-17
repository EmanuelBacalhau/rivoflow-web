import { useMutation } from "@tanstack/react-query";
import { EdgeService } from "@/services/EdgeService";

export function useDeleteEdgesController() {
  const { mutateAsync } = useMutation({
    mutationKey: ["deleteEdge"],
    mutationFn: async (paramsEdge: EdgeService.DeleteParams) => {
      await EdgeService.delete(paramsEdge);
    },
  });

  return {
    deleteEdges: mutateAsync,
  };
}
