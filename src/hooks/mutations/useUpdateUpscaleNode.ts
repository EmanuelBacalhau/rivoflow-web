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
      toast.error("Erro ao atualizar configurações do upscale.");
    },
  });

  return {
    updateUpscaleNode: mutateAsync,
  };
}
