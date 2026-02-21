import { useMutation } from "@tanstack/react-query";
import { NodeService } from "@/services/node/node-service";

export function useUpdateNodePositionController() {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateNodePosition"],
    mutationFn: async (paramsNode: NodeService.UpdateNodePositionParams) => {
      await NodeService.updatePosition(paramsNode);
    },
  });

  return {
    updatePositionNode: mutateAsync,
  };
}
