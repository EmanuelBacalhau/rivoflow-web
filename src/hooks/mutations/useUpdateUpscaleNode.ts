import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { UpscaleNodeService } from "@/services/node/upscale-node-service";

interface UpdateUpscaleNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateUpscaleNodeController({
  updateNodes,
}: UpdateUpscaleNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateUpscaleNode"],
    mutationFn: async (params: UpscaleNodeService.UpdateParams) => {
      await UpscaleNodeService.update(params);
    },
    onMutate: async (params) => {
      let previousData: Record<string, unknown> = {};

      updateNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === params.nodeId) {
            previousData = n.data as Record<string, unknown>;
            return { ...n, data: { ...n.data, ...params.data } };
          }
          return n;
        }),
      );

      return { nodeId: params.nodeId, previousData };
    },
    onError: (error, _, context) => {
      if (isAxiosError(error) && error.response?.status === 404) return;

      if (context?.previousData) {
        updateNodes((nds) =>
          nds.map((n) =>
            n.id === context.nodeId ? { ...n, data: context.previousData } : n,
          ),
        );
      }

      toast.error("Erro ao atualizar configurações do upscale.");
    },
  });

  return {
    updateUpscaleNode: mutateAsync,
  };
}
