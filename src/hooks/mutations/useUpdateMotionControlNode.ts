import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { MotionControlNodeService } from "@/services/node/motion-control-node-service";

interface UpdateMotionControlNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateMotionControlNodeController({
  updateNodes,
}: UpdateMotionControlNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateMotionControlNode"],
    mutationFn: async (params: MotionControlNodeService.UpdateParams) => {
      await MotionControlNodeService.update(params);
    },
    onMutate: async (params) => {
      updateNodes((prevNodes) =>
        prevNodes.map((n) =>
          n.id === params.nodeId
            ? {
                ...n,
                data: {
                  ...n.data,
                  ...params.data,
                },
              }
            : n,
        ),
      );
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) return;
      toast.error("Erro ao atualizar configurações do motion control.");
    },
  });

  return {
    updateMotionControlNode: mutateAsync,
  };
}
