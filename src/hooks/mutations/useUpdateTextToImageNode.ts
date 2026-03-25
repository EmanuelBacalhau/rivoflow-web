import { useMutation } from "@tanstack/react-query";
import type { Node } from "@xyflow/react";
import { isAxiosError } from "axios";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { TextToImageNodeService } from "@/services/node/text-to-image-node-service";

interface UpdateTextToImageNodeParams {
  updateNodes: Dispatch<SetStateAction<Node[]>>;
}

export function useUpdateTextToImageNodeController({
  updateNodes,
}: UpdateTextToImageNodeParams) {
  const { mutateAsync } = useMutation({
    mutationKey: ["updateTextToImageNode"],
    mutationFn: async (params: TextToImageNodeService.UpdateParams) => {
      await TextToImageNodeService.update(params);
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
      toast.error("Erro ao atualizar configurações do text-to-image.");
    },
  });

  return {
    updateTextToImageNode: mutateAsync,
  };
}
